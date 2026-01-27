// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMarketplace.sol";

/**
 * @title Marketplace
 * @author Decentralized Marketplace Team
 * @notice A decentralized marketplace supporting fixed-price sales and English auctions
 * @dev Implements escrow pattern for secure transactions
 */
contract Marketplace is IMarketplace, ReentrancyGuard, Ownable {
    // State variables
    uint256 private _listingIdCounter;
    uint256 public platformFee; // Fee in basis points (e.g., 250 = 2.5%)
    uint256 public constant MAX_PLATFORM_FEE = 1000; // Max 10%
    uint256 public constant MIN_AUCTION_DURATION = 1 hours;
    uint256 public constant MAX_AUCTION_DURATION = 30 days;
    uint256 public constant MIN_BID_INCREMENT_PERCENT = 5; // 5% minimum bid increment

    // Mappings
    mapping(uint256 => Listing) private _listings;
    mapping(address => uint256[]) private _userListings;
    mapping(uint256 => mapping(address => uint256)) private _pendingReturns;

    // Array to track active listings
    uint256[] private _activeListingIds;
    mapping(uint256 => uint256) private _activeListingIndex;

    /**
     * @notice Contract constructor
     * @param initialFee Initial platform fee in basis points
     */
    constructor(uint256 initialFee) Ownable(msg.sender) {
        require(initialFee <= MAX_PLATFORM_FEE, "Fee too high");
        platformFee = initialFee;
    }

    /**
     * @notice Create a new listing
     * @param metadataURI IPFS URI containing item metadata
     * @param price Price in wei (or starting price for auctions)
     * @param isAuction Whether this is an auction listing
     * @param duration Duration in seconds (only for auctions)
     * @return listingId The ID of the created listing
     */
    function createListing(
        string memory metadataURI,
        uint256 price,
        bool isAuction,
        uint256 duration
    ) external override returns (uint256) {
        require(bytes(metadataURI).length > 0, "Empty metadata URI");
        require(price > 0, "Price must be greater than 0");

        uint256 endTime = 0;
        ListingType listingType = ListingType.FixedPrice;

        if (isAuction) {
            require(
                duration >= MIN_AUCTION_DURATION && duration <= MAX_AUCTION_DURATION,
                "Invalid auction duration"
            );
            endTime = block.timestamp + duration;
            listingType = ListingType.Auction;
        }

        uint256 listingId = _listingIdCounter++;

        _listings[listingId] = Listing({
            id: listingId,
            seller: msg.sender,
            metadataURI: metadataURI,
            price: price,
            listingType: listingType,
            status: ListingStatus.Active,
            createdAt: block.timestamp,
            endTime: endTime,
            highestBidder: address(0),
            highestBid: 0
        });

        _userListings[msg.sender].push(listingId);
        _addToActiveListings(listingId);

        emit ListingCreated(
            listingId,
            msg.sender,
            metadataURI,
            price,
            listingType,
            endTime
        );

        return listingId;
    }

    /**
     * @notice Buy an item at fixed price
     * @param listingId The ID of the listing to purchase
     */
    function buyItem(uint256 listingId) external payable override nonReentrant {
        Listing storage listing = _listings[listingId];

        require(listing.status == ListingStatus.Active, "Listing not active");
        require(listing.listingType == ListingType.FixedPrice, "Not a fixed price listing");
        require(msg.sender != listing.seller, "Cannot buy own listing");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.status = ListingStatus.Sold;
        _removeFromActiveListings(listingId);

        // Calculate fees
        uint256 fee = (listing.price * platformFee) / 10000;
        uint256 sellerAmount = listing.price - fee;

        // Transfer funds to seller
        (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success, "Transfer to seller failed");

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }

        emit ItemPurchased(listingId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @notice Place a bid on an auction listing
     * @param listingId The ID of the auction listing
     */
    function placeBid(uint256 listingId) external payable override nonReentrant {
        Listing storage listing = _listings[listingId];

        require(listing.status == ListingStatus.Active, "Listing not active");
        require(listing.listingType == ListingType.Auction, "Not an auction listing");
        require(block.timestamp < listing.endTime, "Auction ended");
        require(msg.sender != listing.seller, "Cannot bid on own listing");

        uint256 minBid;
        if (listing.highestBid == 0) {
            minBid = listing.price;
        } else {
            minBid = listing.highestBid + (listing.highestBid * MIN_BID_INCREMENT_PERCENT) / 100;
        }

        require(msg.value >= minBid, "Bid too low");

        // Store the previous highest bidder's funds for withdrawal
        if (listing.highestBidder != address(0)) {
            _pendingReturns[listingId][listing.highestBidder] += listing.highestBid;
        }

        listing.highestBidder = msg.sender;
        listing.highestBid = msg.value;

        emit BidPlaced(listingId, msg.sender, msg.value);
    }

    /**
     * @notice Withdraw a pending return from being outbid
     * @param listingId The ID of the listing
     */
    function withdrawBid(uint256 listingId) external nonReentrant {
        uint256 amount = _pendingReturns[listingId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        _pendingReturns[listingId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice End an auction and transfer funds/item
     * @param listingId The ID of the auction listing
     */
    function endAuction(uint256 listingId) external override nonReentrant {
        Listing storage listing = _listings[listingId];

        require(listing.status == ListingStatus.Active, "Listing not active");
        require(listing.listingType == ListingType.Auction, "Not an auction listing");
        require(block.timestamp >= listing.endTime, "Auction not yet ended");

        listing.status = ListingStatus.Sold;
        _removeFromActiveListings(listingId);

        if (listing.highestBidder != address(0)) {
            // Calculate fees
            uint256 fee = (listing.highestBid * platformFee) / 10000;
            uint256 sellerAmount = listing.highestBid - fee;

            // Transfer funds to seller
            (bool success, ) = payable(listing.seller).call{value: sellerAmount}("");
            require(success, "Transfer to seller failed");

            emit AuctionEnded(listingId, listing.highestBidder, listing.highestBid);
        } else {
            // No bids - cancel the listing
            listing.status = ListingStatus.Cancelled;
            emit ListingCancelled(listingId);
        }
    }

    /**
     * @notice Cancel a listing (only seller can cancel)
     * @param listingId The ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external override nonReentrant {
        Listing storage listing = _listings[listingId];

        require(listing.status == ListingStatus.Active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");

        // For auctions, can only cancel if no bids
        if (listing.listingType == ListingType.Auction) {
            require(listing.highestBidder == address(0), "Cannot cancel auction with bids");
        }

        listing.status = ListingStatus.Cancelled;
        _removeFromActiveListings(listingId);

        emit ListingCancelled(listingId);
    }

    /**
     * @notice Get listing details
     * @param listingId The ID of the listing
     * @return The listing struct
     */
    function getListing(uint256 listingId) external view override returns (Listing memory) {
        require(listingId < _listingIdCounter, "Listing does not exist");
        return _listings[listingId];
    }

    /**
     * @notice Get all listing IDs for a user
     * @param user The address of the user
     * @return Array of listing IDs
     */
    function getListingsByUser(address user) external view override returns (uint256[] memory) {
        return _userListings[user];
    }

    /**
     * @notice Get all active listing IDs
     * @return Array of active listing IDs
     */
    function getActiveListings() external view override returns (uint256[] memory) {
        return _activeListingIds;
    }

    /**
     * @notice Get the current platform fee
     * @return The platform fee in basis points
     */
    function getPlatformFee() external view override returns (uint256) {
        return platformFee;
    }

    /**
     * @notice Get pending return amount for a bidder
     * @param listingId The ID of the listing
     * @param bidder The address of the bidder
     * @return The amount available for withdrawal
     */
    function getPendingReturn(uint256 listingId, address bidder) external view returns (uint256) {
        return _pendingReturns[listingId][bidder];
    }

    /**
     * @notice Get the total number of listings created
     * @return The listing counter
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIdCounter;
    }

    /**
     * @notice Update the platform fee (only owner)
     * @param newFee The new fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_PLATFORM_FEE, "Fee too high");
        uint256 oldFee = platformFee;
        platformFee = newFee;
        emit PlatformFeeUpdated(oldFee, newFee);
    }

    /**
     * @notice Withdraw accumulated platform fees (only owner)
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Internal functions

    function _addToActiveListings(uint256 listingId) internal {
        _activeListingIndex[listingId] = _activeListingIds.length;
        _activeListingIds.push(listingId);
    }

    function _removeFromActiveListings(uint256 listingId) internal {
        uint256 index = _activeListingIndex[listingId];
        uint256 lastIndex = _activeListingIds.length - 1;

        if (index != lastIndex) {
            uint256 lastListingId = _activeListingIds[lastIndex];
            _activeListingIds[index] = lastListingId;
            _activeListingIndex[lastListingId] = index;
        }

        _activeListingIds.pop();
        delete _activeListingIndex[listingId];
    }

    // Allow contract to receive ETH
    receive() external payable {}
}

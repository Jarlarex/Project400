// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IMarketplace
 * @notice Interface for the decentralized marketplace contract
 */
interface IMarketplace {
    /// @notice Listing status enum
    enum ListingStatus {
        Active,
        Sold,
        Cancelled
    }

    /// @notice Listing type enum
    enum ListingType {
        FixedPrice,
        Auction
    }

    /// @notice Listing struct containing all listing information
    struct Listing {
        uint256 id;
        address seller;
        string metadataURI;
        uint256 price;
        ListingType listingType;
        ListingStatus status;
        uint256 createdAt;
        uint256 endTime; // For auctions
        address highestBidder;
        uint256 highestBid;
    }

    /// @notice Emitted when a new listing is created
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        string metadataURI,
        uint256 price,
        ListingType listingType,
        uint256 endTime
    );

    /// @notice Emitted when an item is purchased
    event ItemPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    /// @notice Emitted when a bid is placed
    event BidPlaced(
        uint256 indexed listingId,
        address indexed bidder,
        uint256 amount
    );

    /// @notice Emitted when an auction ends
    event AuctionEnded(
        uint256 indexed listingId,
        address indexed winner,
        uint256 amount
    );

    /// @notice Emitted when a listing is cancelled
    event ListingCancelled(uint256 indexed listingId);

    /// @notice Emitted when platform fee is updated
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    // Core functions
    function createListing(
        string memory metadataURI,
        uint256 price,
        bool isAuction,
        uint256 duration
    ) external returns (uint256);

    function buyItem(uint256 listingId) external payable;

    function placeBid(uint256 listingId) external payable;

    function endAuction(uint256 listingId) external;

    function cancelListing(uint256 listingId) external;

    // View functions
    function getListing(uint256 listingId) external view returns (Listing memory);

    function getListingsByUser(address user) external view returns (uint256[] memory);

    function getActiveListings() external view returns (uint256[] memory);

    function getPlatformFee() external view returns (uint256);
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Marketplace } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Marketplace", function () {
  // Constants
  const PLATFORM_FEE = 250; // 2.5%
  const ONE_ETH = ethers.parseEther("1");
  const METADATA_URI = "ipfs://QmTestHash123";
  const ONE_HOUR = 3600;
  const ONE_DAY = 86400;

  async function deployMarketplaceFixture() {
    const [owner, seller, buyer, bidder1, bidder2] = await ethers.getSigners();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(PLATFORM_FEE);

    return { marketplace, owner, seller, buyer, bidder1, bidder2 };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { marketplace, owner } = await loadFixture(deployMarketplaceFixture);
      expect(await marketplace.owner()).to.equal(owner.address);
    });

    it("Should set the correct platform fee", async function () {
      const { marketplace } = await loadFixture(deployMarketplaceFixture);
      expect(await marketplace.platformFee()).to.equal(PLATFORM_FEE);
    });

    it("Should reject deployment with fee too high", async function () {
      const Marketplace = await ethers.getContractFactory("Marketplace");
      await expect(Marketplace.deploy(1001)).to.be.revertedWith("Fee too high");
    });
  });

  describe("Fixed Price Listings", function () {
    it("Should create a fixed price listing", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);

      await expect(
        marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0)
      )
        .to.emit(marketplace, "ListingCreated")
        .withArgs(0, seller.address, METADATA_URI, ONE_ETH, 0, 0);

      const listing = await marketplace.getListing(0);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(ONE_ETH);
      expect(listing.listingType).to.equal(0); // FixedPrice
      expect(listing.status).to.equal(0); // Active
    });

    it("Should reject listing with empty metadata", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await expect(
        marketplace.connect(seller).createListing("", ONE_ETH, false, 0)
      ).to.be.revertedWith("Empty metadata URI");
    });

    it("Should reject listing with zero price", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await expect(
        marketplace.connect(seller).createListing(METADATA_URI, 0, false, 0)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should allow buying a fixed price item", async function () {
      const { marketplace, seller, buyer } = await loadFixture(deployMarketplaceFixture);

      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await expect(
        marketplace.connect(buyer).buyItem(0, { value: ONE_ETH })
      )
        .to.emit(marketplace, "ItemPurchased")
        .withArgs(0, buyer.address, seller.address, ONE_ETH);

      const listing = await marketplace.getListing(0);
      expect(listing.status).to.equal(1); // Sold

      // Check seller received payment minus fee
      const expectedPayment = ONE_ETH - (ONE_ETH * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedPayment);
    });

    it("Should reject buying own listing", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      await expect(
        marketplace.connect(seller).buyItem(0, { value: ONE_ETH })
      ).to.be.revertedWith("Cannot buy own listing");
    });

    it("Should reject insufficient payment", async function () {
      const { marketplace, seller, buyer } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      await expect(
        marketplace.connect(buyer).buyItem(0, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should refund excess payment", async function () {
      const { marketplace, seller, buyer } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);

      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await marketplace.connect(buyer).buyItem(0, { value: ethers.parseEther("2") });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      // Buyer should only lose 1 ETH + gas
      expect(buyerBalanceBefore - buyerBalanceAfter - gasUsed).to.equal(ONE_ETH);
    });
  });

  describe("Auction Listings", function () {
    it("Should create an auction listing", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);

      const duration = ONE_DAY;
      const tx = await marketplace.connect(seller).createListing(
        METADATA_URI,
        ONE_ETH,
        true,
        duration
      );
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);
      const expectedEndTime = block!.timestamp + duration;

      const listing = await marketplace.getListing(0);
      expect(listing.listingType).to.equal(1); // Auction
      expect(listing.endTime).to.equal(expectedEndTime);
    });

    it("Should reject auction with invalid duration", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      // Too short
      await expect(
        marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, 60)
      ).to.be.revertedWith("Invalid auction duration");
      // Too long
      await expect(
        marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, 31 * ONE_DAY)
      ).to.be.revertedWith("Invalid auction duration");
    });

    it("Should allow placing bids", async function () {
      const { marketplace, seller, bidder1 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);

      await expect(
        marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH })
      )
        .to.emit(marketplace, "BidPlaced")
        .withArgs(0, bidder1.address, ONE_ETH);

      const listing = await marketplace.getListing(0);
      expect(listing.highestBidder).to.equal(bidder1.address);
      expect(listing.highestBid).to.equal(ONE_ETH);
    });

    it("Should require minimum bid increment", async function () {
      const { marketplace, seller, bidder1, bidder2 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);
      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });

      // Bid must be at least 5% higher
      const minNewBid = ONE_ETH + (ONE_ETH * BigInt(5)) / BigInt(100);
      await expect(
        marketplace.connect(bidder2).placeBid(0, { value: ONE_ETH })
      ).to.be.revertedWith("Bid too low");

      await expect(
        marketplace.connect(bidder2).placeBid(0, { value: minNewBid })
      ).to.emit(marketplace, "BidPlaced");
    });

    it("Should allow outbid users to withdraw", async function () {
      const { marketplace, seller, bidder1, bidder2 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);
      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });

      const bidder1BalanceBefore = await ethers.provider.getBalance(bidder1.address);

      // bidder2 outbids
      await marketplace.connect(bidder2).placeBid(0, { value: ethers.parseEther("2") });

      // bidder1 withdraws
      const tx = await marketplace.connect(bidder1).withdrawBid(0);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const bidder1BalanceAfter = await ethers.provider.getBalance(bidder1.address);
      expect(bidder1BalanceAfter - bidder1BalanceBefore + gasUsed).to.equal(ONE_ETH);
    });

    it("Should end auction and transfer funds to seller", async function () {
      const { marketplace, seller, bidder1 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_HOUR);
      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });

      // Fast forward past auction end
      await time.increase(ONE_HOUR + 1);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await expect(marketplace.endAuction(0))
        .to.emit(marketplace, "AuctionEnded")
        .withArgs(0, bidder1.address, ONE_ETH);

      const expectedPayment = ONE_ETH - (ONE_ETH * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedPayment);

      const listing = await marketplace.getListing(0);
      expect(listing.status).to.equal(1); // Sold
    });

    it("Should reject ending auction before time", async function () {
      const { marketplace, seller, bidder1 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);
      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });

      await expect(marketplace.endAuction(0)).to.be.revertedWith("Auction not yet ended");
    });

    it("Should cancel auction with no bids", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_HOUR);

      await time.increase(ONE_HOUR + 1);

      await expect(marketplace.endAuction(0))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(0);

      const listing = await marketplace.getListing(0);
      expect(listing.status).to.equal(2); // Cancelled
    });
  });

  describe("Listing Cancellation", function () {
    it("Should allow seller to cancel fixed price listing", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);

      await expect(marketplace.connect(seller).cancelListing(0))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(0);

      const listing = await marketplace.getListing(0);
      expect(listing.status).to.equal(2); // Cancelled
    });

    it("Should allow seller to cancel auction with no bids", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);

      await expect(marketplace.connect(seller).cancelListing(0))
        .to.emit(marketplace, "ListingCancelled");
    });

    it("Should reject cancelling auction with bids", async function () {
      const { marketplace, seller, bidder1 } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);
      await marketplace.connect(bidder1).placeBid(0, { value: ONE_ETH });

      await expect(
        marketplace.connect(seller).cancelListing(0)
      ).to.be.revertedWith("Cannot cancel auction with bids");
    });

    it("Should reject non-seller cancellation", async function () {
      const { marketplace, seller, buyer } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);

      await expect(
        marketplace.connect(buyer).cancelListing(0)
      ).to.be.revertedWith("Not the seller");
    });
  });

  describe("View Functions", function () {
    it("Should return user listings", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      await marketplace.connect(seller).createListing(METADATA_URI, ethers.parseEther("2"), false, 0);

      const listings = await marketplace.getListingsByUser(seller.address);
      expect(listings.length).to.equal(2);
      expect(listings[0]).to.equal(0);
      expect(listings[1]).to.equal(1);
    });

    it("Should return active listings", async function () {
      const { marketplace, seller, buyer } = await loadFixture(deployMarketplaceFixture);
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      await marketplace.connect(seller).createListing(METADATA_URI, ethers.parseEther("2"), false, 0);

      let activeListings = await marketplace.getActiveListings();
      expect(activeListings.length).to.equal(2);

      // Buy one item
      await marketplace.connect(buyer).buyItem(0, { value: ONE_ETH });

      activeListings = await marketplace.getActiveListings();
      expect(activeListings.length).to.equal(1);
      expect(activeListings[0]).to.equal(1);
    });

    it("Should return total listings count", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      expect(await marketplace.getTotalListings()).to.equal(0);

      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      expect(await marketplace.getTotalListings()).to.equal(1);

      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, true, ONE_DAY);
      expect(await marketplace.getTotalListings()).to.equal(2);
    });
  });

  describe("Platform Fee Management", function () {
    it("Should allow owner to update fee", async function () {
      const { marketplace, owner } = await loadFixture(deployMarketplaceFixture);

      await expect(marketplace.connect(owner).setPlatformFee(500))
        .to.emit(marketplace, "PlatformFeeUpdated")
        .withArgs(PLATFORM_FEE, 500);

      expect(await marketplace.getPlatformFee()).to.equal(500);
    });

    it("Should reject non-owner fee update", async function () {
      const { marketplace, seller } = await loadFixture(deployMarketplaceFixture);
      await expect(
        marketplace.connect(seller).setPlatformFee(500)
      ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });

    it("Should reject fee above maximum", async function () {
      const { marketplace, owner } = await loadFixture(deployMarketplaceFixture);
      await expect(
        marketplace.connect(owner).setPlatformFee(1001)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to withdraw fees", async function () {
      const { marketplace, owner, seller, buyer } = await loadFixture(deployMarketplaceFixture);

      // Create and buy a listing to generate fees
      await marketplace.connect(seller).createListing(METADATA_URI, ONE_ETH, false, 0);
      await marketplace.connect(buyer).buyItem(0, { value: ONE_ETH });

      const expectedFees = (ONE_ETH * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await marketplace.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore + gasUsed).to.equal(expectedFees);
    });
  });
});

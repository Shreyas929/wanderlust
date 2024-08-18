const Listing=require("../models/listing");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken:mapToken});

module.exports.index=async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
        path:"author",
       },
    })
    .populate("owner");
    if (!listing) {
      req.flash("error","Listing you requested for does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createList = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();
  
    let url = req.file.path;
    let filename = req.file.filename;
  
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New listing Created");
    res.redirect("/listings");
  };
    

  module.exports.editList=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error","Listing you requested for does not exists");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }    

  module.exports.updateList=async (req, res, next) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if(typeof req.file != "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      updatedListing.image={url,filename}
      await updatedListing.save();
    }
    req.flash("success", "Edited successfully");
    res.redirect(`/listings/${id}`);
  };
  
  module.exports.deleteList=async (req, res, next) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      req.flash("error","Listing you requested for does not exists");
      res.redirect("/listings");
    }
    req.flash("success", "Deleted successfully");
    res.redirect("/listings");
  }

  module.exports.searchlist = async (req, res, next) => {
    const { query } = req.body;

    // Ensure there is a search query
    if (!query) {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }

    // Search for listings with titles or locations that contain the search term (case-insensitive)
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } }, // Search in title
            { location: { $regex: query, $options: "i" } } // Search in location
        ]
    });

    if (allListings.length === 0) {
        req.flash("error", "No listings found matching your search.");
        return res.redirect("/listings");
    }
    
    res.render("listings/index.ejs", { allListings });
};

module.exports.beach = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Beach" });
    if (allListings.length === 0) {
      req.flash("error", "No beach listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving beach listings.");
    res.redirect("/listings");
  }
};


module.exports.tropical = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Tropical" });
    if (allListings.length === 0) {
      req.flash("error", "No tropical listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving tropical listings.");
    res.redirect("/listings");
  }
};

module.exports.farm = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Farm" });
    if (allListings.length === 0) {
      req.flash("error", "No farm listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving farm listings.");
    res.redirect("/listings");
  }
};

module.exports.cities = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Cities" });
    if (allListings.length === 0) {
      req.flash("error", "No city listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving city listings.");
    res.redirect("/listings");
  }
};

module.exports.camping = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Camping" });
    if (allListings.length === 0) {
      req.flash("error", "No camping listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving camping listings.");
    res.redirect("/listings");
  }
};
module.exports.historical = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Historical" });
    if (allListings.length === 0) {
      req.flash("error", "No historical listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving beach listings.");
    res.redirect("/listings");
  }
};
module.exports.lake = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Lake" });
    if (allListings.length === 0) {
      req.flash("error", "No lake listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving beach listings.");
    res.redirect("/listings");
  }
};
module.exports.artic = async (req, res, next) => {
  try {
    const allListings = await Listing.find({ category: "Artic" });
    if (allListings.length === 0) {
      req.flash("error", "No artic listings found.");
      return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    req.flash("error", "An error occurred while retrieving beach listings.");
    res.redirect("/listings");
  }
};

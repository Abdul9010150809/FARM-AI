const express = require('express');
const CropData = require('../models/CropData');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await CropData.find().sort({ name: 1 });
    res.json(crops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crop by ID
router.get('/:id', async (req, res) => {
  try {
    const crop = await CropData.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crops by region
router.get('/region/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const crops = await CropData.find({ regions: region }).sort({ name: 1 });
    res.json(crops);
  } catch (error) {
    console.error('Get crops by region error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crops by soil type
router.get('/soil/:soilType', async (req, res) => {
  try {
    const { soilType } = req.params;
    const crops = await CropData.find({ suitableSoilTypes: soilType }).sort({ name: 1 });
    res.json(crops);
  } catch (error) {
    console.error('Get crops by soil error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search crops by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const crops = await CropData.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { scientificName: { $regex: query, $options: 'i' } }
      ]
    }).sort({ name: 1 });

    res.json(crops);
  } catch (error) {
    console.error('Search crops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crop recommendations based on location and soil
router.post('/recommendations', async (req, res) => {
  try {
    const { region, soilType, waterAvailability } = req.body;

    let query = {};
    if (region) query.regions = region;
    if (soilType) query.suitableSoilTypes = soilType;

    const crops = await CropData.find(query).sort({ name: 1 });

    // Filter by water requirements if specified
    let filteredCrops = crops;
    if (waterAvailability) {
      filteredCrops = crops.filter(crop => {
        if (waterAvailability === 'low' && crop.waterRequirements === 'Low') return true;
        if (waterAvailability === 'medium' && crop.waterRequirements === 'Medium') return true;
        if (waterAvailability === 'high' && crop.waterRequirements === 'High') return true;
        return false;
      });
    }

    res.json(filteredCrops);
  } catch (error) {
    console.error('Crop recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new crop (admin only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const crop = new CropData(req.body);
    await crop.save();

    res.status(201).json({
      message: 'Crop added successfully',
      crop
    });
  } catch (error) {
    console.error('Add crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crop (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const crop = await CropData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete crop (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const crop = await CropData.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
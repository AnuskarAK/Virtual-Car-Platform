const express = require('express');
const Build = require('../models/Build');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/builds
// @desc    Save a new build
router.post('/', protect, async (req, res) => {
    try {
        const { car, name, modifications } = req.body;

        const build = await Build.create({
            user: req.user._id,
            car,
            name,
            modifications,
        });

        res.status(201).json(build);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/builds
// @desc    Get user's builds
router.get('/', protect, async (req, res) => {
    try {
        const builds = await Build.find({ user: req.user._id })
            .populate('car', 'name brand image')
            .sort('-createdAt');
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/builds/:id
// @desc    Get single build
router.get('/:id', protect, async (req, res) => {
    try {
        const build = await Build.findById(req.params.id).populate('car');
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }
        if (build.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(build);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/builds/:id
// @desc    Update a build
router.put('/:id', protect, async (req, res) => {
    try {
        let build = await Build.findById(req.params.id);
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }
        if (build.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        build = await Build.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(build);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/builds/:id
// @desc    Delete a build
router.delete('/:id', protect, async (req, res) => {
    try {
        const build = await Build.findById(req.params.id);
        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }
        if (build.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Build.findByIdAndDelete(req.params.id);
        res.json({ message: 'Build removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

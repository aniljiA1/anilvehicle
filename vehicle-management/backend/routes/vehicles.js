const express = require('express');
const router = express.Router();
const { run, get, all } = require('../config/db');

// GET ALL VEHICLES
router.get('/', async (req, res) => {
  try {
    const vehicles = await all(
      'SELECT id, vehicle_code, vehicle_no, created_at, updated_at FROM Vehicles ORDER BY created_at DESC'
    );
    res.json({ success: true, message: 'Vehicles fetched successfully', data: vehicles, total: vehicles.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// GET SINGLE VEHICLE
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await get('SELECT * FROM Vehicles WHERE id = ?', [req.params.id]);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ADD NEW VEHICLE
router.post('/', async (req, res) => {
  try {
    const { vehicle_code, vehicle_no } = req.body;

    if (!vehicle_code || !vehicle_no) {
      return res.status(400).json({ success: false, message: 'Both vehicle_code and vehicle_no are required' });
    }

    const code = vehicle_code.trim().toUpperCase();
    const no = vehicle_no.trim().toUpperCase();

    const dupCode = await get('SELECT id FROM Vehicles WHERE vehicle_code = ?', [code]);
    if (dupCode) return res.status(409).json({ success: false, message: 'This vehicle_code already exists' });

    const dupNo = await get('SELECT id FROM Vehicles WHERE vehicle_no = ?', [no]);
    if (dupNo) return res.status(409).json({ success: false, message: 'This vehicle_no already exists' });

    const result = await run('INSERT INTO Vehicles (vehicle_code, vehicle_no) VALUES (?, ?)', [code, no]);
    const newVehicle = await get('SELECT * FROM Vehicles WHERE id = ?', [result.lastID]);

    res.status(201).json({ success: true, message: 'Vehicle added successfully!', data: newVehicle });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// UPDATE VEHICLE
router.put('/:id', async (req, res) => {
  try {
    const { vehicle_code, vehicle_no } = req.body;
    const { id } = req.params;

    if (!vehicle_code || !vehicle_no) {
      return res.status(400).json({ success: false, message: 'Both vehicle_code and vehicle_no are required' });
    }

    const existing = await get('SELECT id FROM Vehicles WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    await run(
      "UPDATE Vehicles SET vehicle_code = ?, vehicle_no = ?, updated_at = datetime('now', 'localtime') WHERE id = ?",
      [vehicle_code.trim().toUpperCase(), vehicle_no.trim().toUpperCase(), id]
    );

    const updated = await get('SELECT * FROM Vehicles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Vehicle updated successfully!', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE VEHICLE
router.delete('/:id', async (req, res) => {
  try {
    const result = await run('DELETE FROM Vehicles WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, message: 'Vehicle deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;

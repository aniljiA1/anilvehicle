const { run, get } = require('./db');

const sampleVehicles = [
  { code: 'VH001', no: 'MH-12-AB-1234' },
  { code: 'VH002', no: 'DL-01-CD-5678' },
  { code: 'VH003', no: 'RJ-14-EF-9012' },
  { code: 'VH004', no: 'GJ-01-GH-3456' },
  { code: 'VH005', no: 'KA-09-IJ-7890' },
  { code: 'VH006', no: 'TN-22-KL-1122' },
  { code: 'VH007', no: 'UP-32-MN-3344' },
  { code: 'VH008', no: 'MP-09-OP-5566' },
  { code: 'VH009', no: 'WB-06-QR-7788' },
  { code: 'VH010', no: 'AP-28-ST-9900' },
  { code: 'TRK001', no: 'MH-43-UV-1111' },
  { code: 'TRK002', no: 'DL-08-WX-2222' },
  { code: 'TRK003', no: 'RJ-20-YZ-3333' },
  { code: 'TRK004', no: 'GJ-15-AA-4444' },
  { code: 'TRK005', no: 'KA-41-BB-5555' },
  { code: 'TRK006', no: 'TN-11-CC-6666' },
  { code: 'TRK007', no: 'UP-65-DD-7777' },
  { code: 'TRK008', no: 'MP-19-EE-8888' },
  { code: 'TRK009', no: 'WB-23-FF-9999' },
  { code: 'TRK010', no: 'AP-05-GG-0001' },
  { code: 'BUS001', no: 'MH-01-HH-1001' },
  { code: 'BUS002', no: 'DL-02-II-1002' },
  { code: 'BUS003', no: 'RJ-03-JJ-1003' },
  { code: 'BUS004', no: 'GJ-04-KK-1004' },
  { code: 'BUS005', no: 'KA-05-LL-1005' },
  { code: 'VAN001', no: 'TN-06-MM-2001' },
  { code: 'VAN002', no: 'UP-07-NN-2002' },
  { code: 'VAN003', no: 'MP-08-OO-2003' },
  { code: 'VAN004', no: 'WB-09-PP-2004' },
  { code: 'VAN005', no: 'AP-10-QQ-2005' },
  { code: 'JCB001', no: 'MH-15-RR-3001' },
  { code: 'JCB002', no: 'DL-16-SS-3002' },
  { code: 'JCB003', no: 'RJ-17-TT-3003' },
  { code: 'JCB004', no: 'GJ-18-UU-3004' },
  { code: 'JCB005', no: 'KA-19-VV-3005' },
  { code: 'DMP001', no: 'TN-20-WW-4001' },
  { code: 'DMP002', no: 'UP-21-XX-4002' },
  { code: 'DMP003', no: 'MP-22-YY-4003' },
  { code: 'DMP004', no: 'WB-23-ZZ-4004' },
  { code: 'DMP005', no: 'AP-24-AB-4005' },
  { code: 'CRN001', no: 'MH-25-BC-5001' },
  { code: 'CRN002', no: 'DL-26-CD-5002' },
  { code: 'CRN003', no: 'RJ-27-DE-5003' },
  { code: 'CRN004', no: 'GJ-28-EF-5004' },
  { code: 'CRN005', no: 'KA-29-FG-5005' },
  { code: 'MXR001', no: 'TN-30-GH-6001' },
  { code: 'MXR002', no: 'UP-31-HI-6002' },
  { code: 'MXR003', no: 'MP-32-IJ-6003' },
  { code: 'MXR004', no: 'WB-33-JK-6004' },
  { code: 'MXR005', no: 'AP-34-KL-6005' },
  { code: 'TNK001', no: 'MH-35-LM-7001' },
  { code: 'TNK002', no: 'DL-36-MN-7002' },
  { code: 'TNK003', no: 'RJ-37-NO-7003' },
  { code: 'TNK004', no: 'GJ-38-OP-7004' },
  { code: 'TNK005', no: 'KA-39-PQ-7005' },
  { code: 'AMB001', no: 'TN-40-QR-8001' },
  { code: 'AMB002', no: 'UP-41-RS-8002' },
  { code: 'AMB003', no: 'MP-42-ST-8003' },
];

const initDB = async () => {
  try {
    // Create table
    await run(`
      CREATE TABLE IF NOT EXISTS Vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_code TEXT NOT NULL UNIQUE,
        vehicle_no TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT DEFAULT (datetime('now', 'localtime'))
      )
    `);

    // Insert sample data only if empty
    const count = await get('SELECT COUNT(*) as cnt FROM Vehicles');
    if (count.cnt === 0) {
      for (const v of sampleVehicles) {
        await run(
          'INSERT INTO Vehicles (vehicle_code, vehicle_no) VALUES (?, ?)',
          [v.code, v.no]
        );
      }
      console.log(`✅ ${sampleVehicles.length} sample vehicles inserted!`);
    }

    console.log('✅ Database initialized successfully!');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
};

module.exports = initDB;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Kết nối MongoDB
// Kết nối MongoDB
const MONGO_URI = 'mongodb+srv://vietnamtanphu:Abcd1234%21@cluster0.43celhn.mongodb.net/logsDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(() => console.log('✅ Kết nối MongoDB thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Schema và Model
const logSchema = new mongoose.Schema({
  username: { type: String, required: true },
  ca: { type: String, required: true },
  machineName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  error: { type: String, required: true },
  errorDuration: { type: Number, required: true },
  solution: { type: String }, // optional
  errorType: { type: String, required: true },
  supporter: { type: String, required: true }
});

const Log = mongoose.model('Log', logSchema);

// API: Lưu log mới
app.post('/api/back', async (req, res) => {
  const {
    username, ca, machineName, startTime,
    endTime, error, errorDuration, solution,
    errorType, supporter
  } = req.body;

  if (!username || !ca || !machineName || !startTime || !endTime || !error || !errorDuration || !errorType || !supporter) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ. Vui lòng điền đầy đủ thông tin.' });
  }

  try {
    const newLog = new Log({
      username, ca, machineName, startTime,
      endTime, error, errorDuration, solution,
      errorType, supporter
    });

    await newLog.save();
    res.status(200).json({ message: 'Lưu dữ liệu thành công!' });
  } catch (err) {
    console.error('❌ Lỗi khi lưu:', err.message);
    res.status(500).json({ error: 'Lỗi khi lưu dữ liệu.' });
  }
});

// Route fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint không hợp lệ.' });
});

// Chạy server (Render yêu cầu dùng PORT từ môi trường)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});

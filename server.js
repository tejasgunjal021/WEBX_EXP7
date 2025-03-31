const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: Number,
    className: String
});

const Student = mongoose.model("Student", studentSchema);

app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.get("/students/:id", async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
});

// 3️⃣ Add a New Student
app.post("/students", async (req, res) => {
    const { name, rollNo, className } = req.body;
    const newStudent = new Student({ name, rollNo, className });
    await newStudent.save();
    res.json(newStudent);
});


app.put("/students/:id", async (req, res) => {
    const { name, rollNo, className } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id, 
        { name, rollNo, className }, 
        { new: true }
    );
    res.json(updatedStudent);
});


app.delete("/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

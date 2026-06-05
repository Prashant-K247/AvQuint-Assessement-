import Task from "../models/Task.js";

export const createTask = async(req, res)=>{
    try {
    //     console.log("BODY:", req.body);
    // console.log("USER:", req.user);
        const {title, description} = req.body;
        const task = await Task.create({title, description, userId : req.user._id});

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({userId: req.user._id}).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id,});
        
        if (!task) {
            return res.status(404).json({message: "Task not found"});
        }
      
        task.title = req.body.title || task.title;
        task.description =req.body.description || task.description;
        const updatedTask = await task.save();
      
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({message: error.message,});
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id});

        if (!task) {
            return res.status(404).json({ message: "Task not found"});
        }

        await task.deleteOne();

        res.json({ message: "Task deleted",});
    } catch (error) {
        res.status(500).json({message: error.message,});
    }
};


export const toggleTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id});
      
        if (!task) {
            return res.status(404).json({message: "Task not found",});
        }
      
        task.status =task.status === "pending"? "completed": "pending";
      
        await task.save();
      
        res.json(task);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
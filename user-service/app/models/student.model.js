module.exports = mongoose => {
    const studentSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        phoneNumber: {
            type: Number,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        email: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        age: {
            type: Number,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        money: {
            type: Number,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
        type: {
            type: String,
            required: true,
            trim: true // Remove leading/trailing whitespace
        },
    });
  
    studentSchema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Student = mongoose.model("Student", studentSchema);
    return Student;
  };
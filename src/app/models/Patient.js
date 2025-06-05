import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  basic_details: {
    title: {
      type: String,
      enum: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof', 'Mx'],
      required: false
    },
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: [true, 'Gender is required']
    },
    birthday: {
      type: Date,
      validate: {
        validator: function(v) {
          return v <= new Date();
        },
        message: 'Birth date cannot be in the future'
      }
    },
    ward: {
      type: String,
      required: [true, 'Ward number is required'],
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    address: {
      type: String,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    city: {
      type: String,
      maxlength: [200, 'City cannot exceed 100 characters']
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  patient_id: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Discharged', 'Deceased'],
    default: 'Active'
  },
  medical_history: {
    smoking: {
      type: String,
      enum: ['Never', 'Former', 'Current', 'Unknown'],
      default: 'Unknown'
    },
    alcohol: {
      type: String,
      enum: ['Never', 'Occasional', 'Regular', 'Heavy', 'Unknown'],
      default: 'Unknown'
    },
    chronic_illness: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }],
    previous_surgeries: [{
      type: String,
      trim: true
    }]
  },
  family_background: [{
    disease: {
      type: String,
      required: true,
      trim: true
    },
    relation: {
      type: String,
      required: true,
      enum: ['Mother', 'Father', 'Sibling', 'Grandparent', 'Other']
    },
    _id: false
  }],
  vitals: {
    type: Map,
    of: new mongoose.Schema({
      weight: {
        type: Number,
        min: [0, 'Weight cannot be negative'],
        max: [300, 'Weight cannot exceed 300kg']
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
        max: [250, 'Height cannot exceed 250cm']
      },
      blood_pressure: {
        type: String,
        match: [/^\d{2,3}\/\d{2,3}$/, 'Use format: 120/80']
      },
      pulse: {
        type: Number,
        min: [30, 'Pulse too low'],
        max: [200, 'Pulse too high']
      },
      temperature: {
        type: Number,
        min: [30, 'Temperature too low'],
        max: [45, 'Temperature too high']
      },
      general_observations: [String],
      special_notes: {
        type: String,
        maxlength: 200
      }
    }, { _id: false })
  },
  primary_diagnosis: {
    cancer_type: {
      type: String,
      trim: true
    },
    sub_category: {
      type: String,
      trim: true
    },
    stage: {
      type: String,
      enum: ['0', 'I', 'II', 'III', 'IV', 'Unknown'],
      default: 'Unknown'
    },
    date_assessed: {
      type: Date,
      validate: {
        validator: function(v) {
          return v <= new Date();
        },
        message: 'Assessment date cannot be in the future'
      }
    },
    findings: String,
    suspicious_lumps: String,
    pain_assessment: {
      type: String,
      enum: ['None', 'Mild', 'Moderate', 'Severe', 'Unknown'],
      default: 'Unknown'
    },
    consulting_doctor: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  lab_results: {
    blood_tests: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      result: {
        type: String,
        required: true
      },
      _id: false
    }],
    imaging_studies: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      result: {
        type: String,
        required: true
      },
      _id: false
    }],
    other_investigations: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      result: {
        type: String,
        required: true
      },
      _id: false
    }]
  },
  medications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    dosage: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: Date,
    _id: false
  }],
  surgeries: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    notes: String,
    complication: String,
    _id: false
  }],
  patient_log: [{
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      required: true,
      maxlength: 500
    },
    _id: false
  }],
  complications_and_risks: [{
    date: {
      type: Date,
      default: Date.now
    },
    complication: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical'],
      required: true
    },
    _id: false
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
PatientSchema.virtual('basic_details.full_name').get(function() {
  return `${this.basic_details.first_name} ${this.basic_details.last_name}`;
});

// Index for better search performance
PatientSchema.index({ 'basic_details.first_name': 'text', 'basic_details.last_name': 'text' });

// Pre-save hook for patient_id generation
PatientSchema.pre('save', async function(next) {
  if (!this.patient_id) {
    const lastPatient = await this.constructor.findOne().sort({ patient_id: -1 });
    const lastId = lastPatient ? parseInt(lastPatient.patient_id.split('-')[1]) : 0;
    this.patient_id = `PT-${(lastId + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Prevent model re-registration during hot reloads
const Patient = mongoose.models?.Patient || mongoose.model('Patient', PatientSchema);

export default Patient;
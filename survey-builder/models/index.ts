import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  status: { type: String, default: 'Active' },
  permissions: { type: String, default: '[]' }
});

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const ProvinceSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const DistrictSchema = new mongoose.Schema({
  name: { type: String, required: true },
  province_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' }
});

const CommuneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district_id: { type: mongoose.Schema.Types.ObjectId, ref: 'District' }
});

const VillageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  commune_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Commune' }
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  form_id: { type: String, required: true, unique: true },
  schema: { type: Object, required: true },
  status: { type: String, default: 'Draft' }, // Draft, Deployed
  created_at: { type: Date, default: Date.now }
});

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const IndicatorSchema = new mongoose.Schema({
  program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  indicator: { type: String, required: true },
  baseline: { type: String },
  target: { type: String },
  data_source: { type: String },
  frequency: { type: String },
  responsible_role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);
export const Province = mongoose.models.Province || mongoose.model('Province', ProvinceSchema);
export const District = mongoose.models.District || mongoose.model('District', DistrictSchema);
export const Commune = mongoose.models.Commune || mongoose.model('Commune', CommuneSchema);
export const Village = mongoose.models.Village || mongoose.model('Village', VillageSchema);
export const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);
export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
export const Indicator = mongoose.models.Indicator || mongoose.model('Indicator', IndicatorSchema);

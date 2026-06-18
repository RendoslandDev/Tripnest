import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { Camera, RefreshCw, ChevronRight } from 'lucide-react'
import { useDataStore, useAuthStore } from '../store'
import IDCardFront from '../components/id-card/IDCardFront'
import IDCardBack from '../components/id-card/IDCardBack'
import type { Citizen, IDCard, RegistrationFormData, Gender, MaritalStatus } from '../types'

const STEPS = ['Personal Details', 'Photo Capture', 'Preview & Confirm']

const defaultForm: RegistrationFormData = {
  firstName: '', middleName: '', lastName: '',
  dateOfBirth: '', nationality: 'Ghanaian',
  gender: 'Male', maritalStatus: 'Single',
  address: '', contactNumber: '', photoUrl: '',
}

export default function IssueNew() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<RegistrationFormData>(defaultForm)
  const [photoUrl, setPhotoUrl] = useState('')
  const [cameraMode, setCameraMode] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const { addCitizen, addCard, nextCardId, addAuditLog } = useDataStore()
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot()
    if (img) { setPhotoUrl(img); setCameraMode(false) }
  }, [webcamRef])

  const update = (k: keyof RegistrationFormData, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const previewCitizen: Citizen = {
    id: 'preview',
    ...form,
    gender: form.gender as Gender,
    maritalStatus: form.maritalStatus as MaritalStatus,
    photoUrl: photoUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
  }

  const previewCard: IDCard = {
    cardId: nextCardId(),
    citizenId: 'preview',
    status: 'Pending',
    dateCreated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
    expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '/'),
    issuedBy: currentUser?.id || '',
  }

  const handleGenerate = () => {
    const citizenId = `c${Date.now()}`
    const citizen: Citizen = { ...previewCitizen, id: citizenId }
    const card: IDCard = { ...previewCard, citizenId, status: 'Pending' }
    addCitizen(citizen)
    addCard(card)
    addAuditLog({
      action: 'ID Issued',
      performedBy: currentUser?.name || 'Officer',
      targetId: card.cardId,
      timestamp: new Date().toLocaleString(),
      details: `New ID card issued for ${citizen.firstName} ${citizen.lastName}`,
    })
    navigate('/pending')
  }

  const step1Valid = form.firstName && form.lastName && form.dateOfBirth && form.address && form.contactNumber

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Issue New ID</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < step ? 'bg-blue-600 border-blue-600 text-white'
              : i === step ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-slate-300 text-slate-400 bg-white'
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${i === step ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 0 && (
        <div className="card p-6 max-w-2xl">
          <h2 className="font-semibold text-slate-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label className="label">Marital Status</label>
              <select className="input" value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}>
                {['Single','Married','Divorced','Widowed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Middle Name (Optional)</label>
              <input className="input" value={form.middleName} onChange={e => update('middleName', e.target.value)} placeholder="Middle name" />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input className="input" type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last name" />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street, City, Region" />
            </div>
            <div>
              <label className="label">Nationality</label>
              <select className="input" value={form.nationality} onChange={e => update('nationality', e.target.value)}>
                {['Ghanaian','Togolese','Nigerian','Other'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input className="input" value={form.contactNumber} onChange={e => update('contactNumber', e.target.value)} placeholder="024 123 4567" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="btn-primary"
              disabled={!step1Valid}
              onClick={() => setStep(1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <div className="card p-6 max-w-md">
          <h2 className="font-semibold text-slate-800 mb-4">Photo Capture</h2>
          <div className="flex flex-col items-center gap-4">
            {cameraMode ? (
              <div className="relative">
                <div className="absolute inset-0 border-4 border-blue-400 rounded-xl pointer-events-none z-10" />
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-64 h-72 object-cover rounded-xl" />
              </div>
            ) : photoUrl ? (
              <img src={photoUrl} className="w-40 h-48 object-cover rounded-xl border-4 border-blue-400" alt="Captured" />
            ) : (
              <div className="w-40 h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                <Camera size={40} className="text-slate-400" />
              </div>
            )}

            <p className="text-xs text-slate-500 text-center">Ensure face is clearly visible</p>

            <div className="flex gap-3">
              {cameraMode ? (
                <button className="btn-primary" onClick={capture}>
                  <Camera size={16} /> Capture Photo
                </button>
              ) : (
                <button className="btn-primary" onClick={() => setCameraMode(true)}>
                  <Camera size={16} /> {photoUrl ? 'Retake Photo' : 'Open Camera'}
                </button>
              )}
              {photoUrl && (
                <button className="btn-outline" onClick={() => { setPhotoUrl(''); setCameraMode(false) }}>
                  <RefreshCw size={16} /> Retake
                </button>
              )}
            </div>

            {!photoUrl && (
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setPhotoUrl(`https://i.pravatar.cc/200?img=${Math.floor(Math.random()*70)+1}`)}
              >
                Use placeholder photo (demo)
              </button>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button className="btn-outline" onClick={() => setStep(0)}>Back</button>
            <button className="btn-primary" disabled={!photoUrl} onClick={() => setStep(2)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card p-6 max-w-2xl">
            <h2 className="font-semibold text-slate-800 mb-4">Preview & Confirm</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                {[
                  ['Full Name', `${form.firstName} ${form.middleName ? form.middleName + ' ' : ''}${form.lastName}`],
                  ['Date of Birth', form.dateOfBirth],
                  ['Nationality', form.nationality],
                  ['Gender', form.gender],
                  ['Marital Status', form.maritalStatus],
                  ['Address', form.address],
                  ['Contact', form.contactNumber],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium text-xs">{k}</span>
                    <span className="text-slate-800 text-xs font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              {photoUrl && (
                <div className="flex justify-center">
                  <img src={photoUrl} className="w-32 h-36 object-cover rounded-xl border border-slate-200" alt="Citizen" />
                </div>
              )}
            </div>
          </div>

          {/* Card preview */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-3 text-sm">Generated ID Card Preview</h3>
            <div className="flex gap-4 flex-wrap">
              <IDCardFront citizen={previewCitizen} card={previewCard} />
              <IDCardBack card={previewCard} />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" onClick={handleGenerate}>
              Generate ID Card
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

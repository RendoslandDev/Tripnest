import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { Camera, RefreshCw, ChevronRight, ChevronLeft, Check, BadgeCheck } from 'lucide-react'
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
  const [fallbackPhotoUrl] = useState(() => `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`)
  const [cardDates] = useState(() => {
    const now = new Date()
    return {
      dateCreated: now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'),
      expiryDate: new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB').replace(/\//g, '/'),
    }
  })
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
    photoUrl: photoUrl || fallbackPhotoUrl,
  }

  const previewCard: IDCard = {
    cardId: nextCardId(),
    citizenId: 'preview',
    status: 'Pending',
    dateCreated: cardDates.dateCreated,
    expiryDate: cardDates.expiryDate,
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
    <div className="p-8 max-w-4xl">
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all shrink-0 ${
                i < step ? 'bg-blue-600 border-blue-600 text-white'
                : i === step ? 'border-blue-600 text-blue-600 bg-white shadow-md shadow-blue-600/20'
                : 'border-slate-200 text-slate-400 bg-white'
              }`}>
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ${i === step ? 'text-slate-900' : i < step ? 'text-slate-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 rounded-full ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 0 && (
        <div className="card p-7 max-w-2xl">
          <h2 className="font-bold text-slate-900 tracking-tight">Personal Information</h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-6">All fields are required unless marked optional.</p>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label className="label">Middle Name (Optional)</label>
              <input className="input" value={form.middleName} onChange={e => update('middleName', e.target.value)} placeholder="Middle name" />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last name" />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input className="input" type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Marital Status</label>
              <select className="input" value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}>
                {['Single', 'Married', 'Divorced', 'Widowed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nationality</label>
              <select className="input" value={form.nationality} onChange={e => update('nationality', e.target.value)}>
                {['Ghanaian', 'Togolese', 'Nigerian', 'Other'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input className="input" value={form.contactNumber} onChange={e => update('contactNumber', e.target.value)} placeholder="024 123 4567" />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street, City, Region" />
            </div>
          </div>
          <div className="flex justify-end mt-7">
            <button className="btn-primary" disabled={!step1Valid} onClick={() => setStep(1)}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <div className="card p-7 max-w-md">
          <h2 className="font-bold text-slate-900 tracking-tight">Photo Capture</h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-6">Ensure the face is clearly visible and well lit.</p>
          <div className="flex flex-col items-center gap-5">
            {cameraMode ? (
              <div className="relative">
                <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl pointer-events-none z-10" />
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-64 h-72 object-cover rounded-2xl" />
              </div>
            ) : photoUrl ? (
              <img src={photoUrl} className="w-44 h-52 object-cover rounded-2xl ring-4 ring-blue-500/30 shadow-lg" alt="Captured" />
            ) : (
              <div className="w-44 h-52 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2">
                <Camera size={36} className="text-slate-300" />
                <p className="text-xs text-slate-400 font-medium">No photo yet</p>
              </div>
            )}

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
                  <RefreshCw size={16} /> Reset
                </button>
              )}
            </div>

            {!photoUrl && (
              <button
                className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                onClick={() => setPhotoUrl(fallbackPhotoUrl)}
              >
                Use placeholder photo (demo)
              </button>
            )}
          </div>
          <div className="flex justify-between mt-7">
            <button className="btn-outline" onClick={() => setStep(0)}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn-primary" disabled={!photoUrl} onClick={() => setStep(2)}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card p-7 max-w-2xl">
            <h2 className="font-bold text-slate-900 tracking-tight mb-5">Review Application</h2>
            <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
              <div className="space-y-1 text-sm">
                {[
                  ['Full Name', `${form.firstName} ${form.middleName ? form.middleName + ' ' : ''}${form.lastName}`],
                  ['Date of Birth', form.dateOfBirth],
                  ['Nationality', form.nationality],
                  ['Gender', form.gender],
                  ['Marital Status', form.maritalStatus],
                  ['Address', form.address],
                  ['Contact', form.contactNumber],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 font-medium text-xs uppercase tracking-wide shrink-0">{k}</span>
                    <span className="text-slate-800 text-sm font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
              {photoUrl && (
                <img src={photoUrl} className="w-32 h-38 object-cover rounded-2xl ring-1 ring-slate-200 shadow-sm" alt="Citizen" />
              )}
            </div>
          </div>

          {/* Card preview */}
          <div className="card p-7">
            <h3 className="font-bold text-slate-900 tracking-tight mb-1">ID Card Preview</h3>
            <p className="text-xs text-slate-500 mb-5">This is how the generated card will look.</p>
            <div className="flex gap-5 flex-wrap p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <IDCardFront citizen={previewCitizen} card={previewCard} />
              <IDCardBack card={previewCard} />
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn-outline" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={handleGenerate}>
              <BadgeCheck size={16} /> Generate ID Card
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

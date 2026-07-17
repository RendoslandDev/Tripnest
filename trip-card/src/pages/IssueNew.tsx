import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import { Camera, RefreshCw, ChevronRight, ChevronLeft, Check, BadgeCheck, Fingerprint, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store'
import { api, ApiError } from '../api/client'
import IDCardFront from '../components/id-card/IDCardFront'
import IDCardBack from '../components/id-card/IDCardBack'
import type { RegistrationFormData } from '../types'

const STEPS = ['Personal Details', 'Photo & Biometrics', 'Review & Submit']

const defaultForm: RegistrationFormData = {
  firstName: '', middleName: '', lastName: '',
  dateOfBirth: '', nationality: 'Ghanaian',
  gender: 'Male', maritalStatus: 'Single',
  address: '', contactNumber: '',
}

function placeholderPhoto(name: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 360
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 300, 360)
  grad.addColorStop(0, '#3B82F6')
  grad.addColorStop(1, '#4F46E5')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 300, 360)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 110px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'ID'
  ctx.fillText(initials, 150, 185)
  return canvas.toDataURL('image/jpeg', 0.9)
}

export default function IssueNew() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<RegistrationFormData>(defaultForm)
  const [photoUrl, setPhotoUrl] = useState('')
  const [cameraMode, setCameraMode] = useState(false)
  const [fingerprintFile, setFingerprintFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  // Phone verification — the backend rejects citizen creation for unverified numbers.
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [smsCode, setSmsCode] = useState('')
  const [devCode, setDevCode] = useState('')
  const [phoneBusy, setPhoneBusy] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const webcamRef = useRef<Webcam>(null)
  const { currentUser } = useAuthStore()
  const navigate = useNavigate()

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot()
    if (img) { setPhotoUrl(img); setCameraMode(false) }
  }, [webcamRef])

  const update = (k: keyof RegistrationFormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (k === 'contactNumber') {
      setPhoneVerified(false)
      setCodeSent(false)
      setSmsCode('')
      setDevCode('')
    }
  }

  const sendCode = async () => {
    setPhoneBusy(true)
    setPhoneError('')
    try {
      const res = await api.phoneVerification.request(form.contactNumber)
      setCodeSent(true)
      setDevCode(res.devCode ?? '')
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : 'Failed to send code')
    } finally {
      setPhoneBusy(false)
    }
  }

  const confirmCode = async () => {
    setPhoneBusy(true)
    setPhoneError('')
    try {
      const res = await api.phoneVerification.confirm(form.contactNumber, smsCode.trim())
      setPhoneVerified(res.verified)
      if (!res.verified) setPhoneError('Code not accepted. Try again.')
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : 'Verification failed')
    } finally {
      setPhoneBusy(false)
    }
  }

  const [previewCard] = useState(() => {
    const now = Date.now()
    return {
      cardId: 'GHA-____-______',
      dateCreated: new Date(now).toISOString(),
      expiryDate: new Date(now + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
  })

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      setProgress('Creating citizen record…')
      const citizen = await api.citizens.create({ ...form })

      setProgress('Uploading photo…')
      const photoBlob = await (await fetch(photoUrl)).blob()
      await api.citizens.uploadPhoto(citizen.id, photoBlob)

      if (fingerprintFile) {
        setProgress('Enrolling fingerprint…')
        await api.biometrics.enroll(citizen.id, fingerprintFile)
      }

      setProgress('Submitting application for review…')
      await api.applications.submit(citizen.id)

      // Verification officers / admins review under Pending; registration
      // officers can't view that list, so send them to Citizens instead.
      navigate(currentUser?.role === 'RegistrationOfficer' ? '/citizens' : '/pending')
    } catch (err) {
      setError(err instanceof ApiError
        ? [err.message, ...err.errors].join(' — ')
        : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
      setProgress('')
    }
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
              <input className="input" value={form.contactNumber} onChange={e => update('contactNumber', e.target.value)} placeholder="0241234567" />
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street, City, Region" />
            </div>

            {/* Phone verification — required before the citizen record can be created */}
            <div className="col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck size={13} className={phoneVerified ? 'text-emerald-600' : 'text-slate-400'} />
                    Phone Verification
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {phoneVerified
                      ? `${form.contactNumber} is verified.`
                      : 'A one-time code must be confirmed for the contact number.'}
                  </p>
                </div>
                {!phoneVerified && (
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs"
                    disabled={!form.contactNumber || phoneBusy}
                    onClick={sendCode}
                  >
                    {phoneBusy && !codeSent ? 'Sending…' : codeSent ? 'Resend Code' : 'Send Code'}
                  </button>
                )}
              </div>
              {codeSent && !phoneVerified && (
                <div className="flex gap-2 mt-3">
                  <input
                    className="input flex-1"
                    placeholder="6-digit code"
                    maxLength={6}
                    value={smsCode}
                    onChange={e => setSmsCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-primary px-4"
                    disabled={smsCode.trim().length !== 6 || phoneBusy}
                    onClick={confirmCode}
                  >
                    Verify
                  </button>
                </div>
              )}
              {devCode && !phoneVerified && (
                <p className="text-[11px] text-amber-600 mt-2">Dev code (no SMS gateway configured): <strong className="font-mono">{devCode}</strong></p>
              )}
              {phoneError && (
                <p className="text-[11px] text-red-600 mt-2">{phoneError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-7">
            <button className="btn-primary" disabled={!step1Valid || !phoneVerified} onClick={() => setStep(1)}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && (
        <div className="card p-7 max-w-md">
          <h2 className="font-bold text-slate-900 tracking-tight">Photo & Biometrics</h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-6">A photo is required. A fingerprint is required before a card can be issued, but can also be enrolled later.</p>
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
                onClick={() => setPhotoUrl(placeholderPhoto(`${form.firstName} ${form.lastName}`))}
              >
                Use placeholder photo (demo)
              </button>
            )}

            {/* Fingerprint upload (SourceAFIS works on image files) */}
            <div className="w-full pt-4 border-t border-slate-100">
              <label className="label flex items-center gap-1.5">
                <Fingerprint size={13} className="text-blue-600" /> Fingerprint image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-slate-500 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-semibold hover:file:bg-blue-100 file:cursor-pointer"
                onChange={e => setFingerprintFile(e.target.files?.[0] ?? null)}
              />
              {fingerprintFile && (
                <p className="text-[11px] text-slate-500 mt-1.5">Selected: {fingerprintFile.name}</p>
              )}
            </div>
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
                  ['Fingerprint', fingerprintFile ? fingerprintFile.name : 'Not enrolled (can be added later)'],
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
            <p className="text-xs text-slate-500 mb-5">The card number is assigned by the system once the application is approved and the card is issued.</p>
            <div className="flex gap-5 flex-wrap p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <IDCardFront citizen={form} card={previewCard} photoSrc={photoUrl} />
              <IDCardBack card={previewCard} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <button className="btn-outline" disabled={submitting} onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-3">
              {progress && <span className="text-xs text-slate-500">{progress}</span>}
              <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
                <BadgeCheck size={16} /> {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

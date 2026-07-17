import { useCitizenPhoto } from '../hooks/useCitizenPhoto'

function initials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function CitizenAvatar({ citizenId, name, hasPhoto = true, className = 'w-8 h-8 rounded-full' }: {
  citizenId?: string
  name: string
  hasPhoto?: boolean
  className?: string
}) {
  const url = useCitizenPhoto(citizenId, hasPhoto)
  if (url) return <img src={url} alt="" className={`${className} object-cover ring-2 ring-slate-100`} />
  return (
    <div className={`${className} bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
      {initials(name) || '?'}
    </div>
  )
}

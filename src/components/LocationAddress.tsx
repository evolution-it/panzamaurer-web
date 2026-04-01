import Image from 'next/image'

type LocationAddressProps = {
  building?: string
  address?: string[]
  city?: string
  phone?: string
  fax?: string
}

export default function LocationAddress({ building, address, city, phone, fax }: LocationAddressProps) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-start gap-3'>
        <Image
          src='/images/location-pin.svg'
          alt=''
          width={18}
          height={18}
          className='mt-1 flex-shrink-0'
        />
        <div>
          {building && <p className='font-semibold text-gray-950'>{building}</p>}
          {address?.map((line, i) => (
            <p key={i} className='font-semibold text-gray-950'>
              {line}
            </p>
          ))}
          {city && <p className='font-semibold text-gray-950'>{city}</p>}
        </div>
      </div>
      {(phone || fax) && (
        <div className='pl-[30px]'>
          {phone && <p className='text-gray-950'>{phone} (T)</p>}
          {fax && <p className='text-gray-950'>{fax} (F)</p>}
        </div>
      )}
    </div>
  )
}

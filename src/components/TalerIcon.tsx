interface TalerIconProps {
  size?: number
}

export default function TalerIcon({ size = 20 }: TalerIconProps) {
  return (
    <img
      src="/images/taler.png"
      alt="Taler"
      width={size}
      height={size}
      className="inline-block ml-1"
    />
  )
}
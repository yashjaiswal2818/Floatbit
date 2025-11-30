import { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactElement
}

export function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-50"
          data-testid="tooltip"
        >
          {text}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black border-l-opacity-80" />
        </div>
      )}
    </div>
  )
}


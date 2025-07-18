import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

const predefinedColors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
  '#7C2D12', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A',
  '#059669', '#0D9488', '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
  '#9333EA', '#C026D3', '#DB2777', '#E11D48'
]

export function ColorPicker({ color, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputColor, setInputColor] = useState(color)

  const handleColorChange = (newColor: string) => {
    setInputColor(newColor)
    onChange(newColor)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: color }}
              />
              <span>{color}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  placeholder="#000000"
                />
                <Button
                  size="sm"
                  onClick={() => handleColorChange(inputColor)}
                >
                  Apply
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Predefined Colors</Label>
              <div className="grid grid-cols-7 gap-2">
                {predefinedColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      color === presetColor
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      handleColorChange(presetColor)
                      setIsOpen(false)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
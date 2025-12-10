import React from 'react'
import './style.css'
import { cls } from '../../utils/cls'

type PropType = {
  selected: boolean
  index: number
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, index, onClick, className } = props
  return (
    <div
      className={cls('embla-thumbs__slide', { 'embla-thumbs__slide--selected': selected }, className)}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        {props.children}
      </button>
    </div>
  )
}

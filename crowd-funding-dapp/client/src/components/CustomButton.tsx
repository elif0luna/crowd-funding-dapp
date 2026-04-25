type CustomButtonProps = {
  btnType?: 'button' | 'submit'
  title: string
  styles?: string
  handleClick?: () => void
  isDisabled?: boolean
  iconUrl?: string
}

const CustomButton = ({ btnType, title, styles, handleClick, isDisabled, iconUrl }: CustomButtonProps) => {
  return (
    <button
      type={btnType ?? 'button'}
      className={`btn ${styles ?? ''}`}
      onClick={handleClick}
      disabled={isDisabled}
    >
      {iconUrl ? <img src={iconUrl} alt="icon" className="btn-icon" /> : null}
      <span>{title}</span>
    </button>
  )
}

export default CustomButton

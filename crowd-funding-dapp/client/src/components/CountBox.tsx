type CountBoxProps = {
  title: string
  value: string | number
}

const CountBox = ({ title, value }: CountBoxProps) => {
  return (
    <div className="count-box">
      <h4 className="count-box-value">{value}</h4>
      <p className="count-box-title">{title}</p>
    </div>
  )
}

export default CountBox

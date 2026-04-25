import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton, FormField, Loader } from '../components'
import { useCampaigns } from '../context'
import { checkIfImage } from '../utils'

const CreateCampaign = () => {
  const navigate = useNavigate()
  const { publishCampaign, isLoading } = useCampaigns()
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  })

  const handleFormFieldChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    checkIfImage(form.image, async (exists) => {
      if (!exists) {
        alert('Provide a valid image URL')
        return
      }

      await publishCampaign(form)
      navigate('/')
    })
  }

  return (
    <div className="page">
      {isLoading ? <Loader /> : null}
      <div className="page-header">
        <h1>Launch a New Campaign</h1>
        <p>Tell your story, set a goal, and invite the community to back you.</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <FormField
            labelName="Campaign Title"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(event) => handleFormFieldChange('title', event.target.value)}
          />
          <FormField
            labelName="Goal Amount (ETH)"
            placeholder="0.25"
            inputType="number"
            value={form.target}
            handleChange={(event) => handleFormFieldChange('target', event.target.value)}
          />
          <FormField
            labelName="Campaign Story"
            placeholder="Community, impact, open-source"
            inputType="text"
            value={form.description}
            handleChange={(event) => handleFormFieldChange('description', event.target.value)}
            isTextArea
          />
          <FormField
            labelName="Deadline (Days)"
            placeholder="30"
            inputType="number"
            value={form.deadline}
            handleChange={(event) => handleFormFieldChange('deadline', event.target.value)}
          />
          <FormField
            labelName="Campaign Image"
            placeholder="Paste an image URL"
            inputType="url"
            value={form.image}
            handleChange={(event) => handleFormFieldChange('image', event.target.value)}
          />
        </div>

        <CustomButton btnType="submit" title="Publish Campaign" styles="btn-primary" />
      </form>
    </div>
  )
}

export default CreateCampaign

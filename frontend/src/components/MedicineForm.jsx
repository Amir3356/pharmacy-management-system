import { useState } from 'react'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  expiry_date: '',
  description: '',
}

export default function MedicineForm({
  initialValues = emptyForm,
  submitLabel = 'Save medicine',
  onSubmit,
  busy = false,
}) {
  const [formData, setFormData] = useState({ ...emptyForm, ...initialValues })

  const updateField = (field) => (event) => {
    setFormData((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="medicine-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Name</span>
          <input className="input" value={formData.name} onChange={updateField('name')} required />
        </label>

        <label className="form-field">
          <span>Category</span>
          <input className="input" value={formData.category} onChange={updateField('category')} required />
        </label>

        <label className="form-field">
          <span>Price</span>
          <input
            className="input"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={updateField('price')}
            required
          />
        </label>

        <label className="form-field">
          <span>Quantity</span>
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={updateField('quantity')}
            required
          />
        </label>

        <label className="form-field">
          <span>Expiry date</span>
          <input className="input" type="date" value={formData.expiry_date} onChange={updateField('expiry_date')} required />
        </label>

        <div className="form-field">
          <span className="form-help">All fields are required except description.</span>
        </div>
      </div>

      <label className="form-field">
        <span>Description</span>
        <textarea
          className="textarea"
          rows="5"
          value={formData.description}
          onChange={updateField('description')}
          placeholder="Add notes for the medicine stock"
        />
      </label>

      <div className="form-footer">
        <p className="form-help">Keep the quantity updated so stock alerts stay accurate.</p>
        <button className="button" type="submit" disabled={busy}>
          {busy ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
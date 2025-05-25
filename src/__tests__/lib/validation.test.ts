import test, { expect } from '@playwright/test';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// If PatientForm is a page component (async), import the actual form component instead
// import PatientForm from '../../app/details/[patient_id]/page';
import PatientForm from '../../components/PatientForm'; // Update the path to your actual form component

test('validates required fields', async () => {
  render(<PatientForm />)
  const submitButton = screen.getByRole('button', { name: /submit/i })
  
  fireEvent.click(submitButton)
  
  await waitFor(() => {
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/ward number is required/i)).toBeInTheDocument()
  })
})

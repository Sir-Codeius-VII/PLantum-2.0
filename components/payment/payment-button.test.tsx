import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentButton from './payment-button'

describe('PaymentButton', () => {
  const mockProps = {
    amount: 100,
    itemName: 'Test Item',
    onSuccess: jest.fn(),
    onError: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders payment button with correct amount', () => {
    render(<PaymentButton {...mockProps} />)
    expect(screen.getByText('Pay R 100.00')).toBeInTheDocument()
  })

  it('opens payment method dialog when clicked', async () => {
    render(<PaymentButton {...mockProps} />)
    const button = screen.getByText('Pay R 100.00')
    await userEvent.click(button)
    
    expect(screen.getByText('Select Payment Method')).toBeInTheDocument()
    expect(screen.getByText('PayFast')).toBeInTheDocument()
    expect(screen.getByText('Stripe')).toBeInTheDocument()
    expect(screen.getByText('Bank Transfer')).toBeInTheDocument()
  })

  it('handles payment method selection', async () => {
    render(<PaymentButton {...mockProps} />)
    const button = screen.getByText('Pay R 100.00')
    await userEvent.click(button)
    
    const payfastOption = screen.getByText('PayFast')
    await userEvent.click(payfastOption)
    
    const confirmButton = screen.getByText('Confirm Payment')
    await userEvent.click(confirmButton)
    
    // Verify that the payment was initiated
    await waitFor(() => {
      expect(mockProps.onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message for invalid amount', async () => {
    render(<PaymentButton {...mockProps} amount={0} />)
    const button = screen.getByText('Pay R 0.00')
    await userEvent.click(button)
    
    expect(screen.getByText('Invalid amount')).toBeInTheDocument()
  })

  it('handles bank transfer selection', async () => {
    render(<PaymentButton {...mockProps} />)
    const button = screen.getByText('Pay R 100.00')
    await userEvent.click(button)
    
    const bankOption = screen.getByText('Bank Transfer')
    await userEvent.click(bankOption)
    
    expect(screen.getByText('Bank Transfer Details')).toBeInTheDocument()
    expect(screen.getByText('Account Number:')).toBeInTheDocument()
    expect(screen.getByText('Reference:')).toBeInTheDocument()
  })

  it('closes dialog when cancel is clicked', async () => {
    render(<PaymentButton {...mockProps} />)
    const button = screen.getByText('Pay R 100.00')
    await userEvent.click(button)
    
    const cancelButton = screen.getByText('Cancel')
    await userEvent.click(cancelButton)
    
    expect(screen.queryByText('Select Payment Method')).not.toBeInTheDocument()
  })

  it('shows loading state during payment processing', async () => {
    render(<PaymentButton {...mockProps} />)
    const button = screen.getByText('Pay R 100.00')
    await userEvent.click(button)
    
    const payfastOption = screen.getByText('PayFast')
    await userEvent.click(payfastOption)
    
    const confirmButton = screen.getByText('Confirm Payment')
    await userEvent.click(confirmButton)
    
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })
}) 
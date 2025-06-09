'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, User, Users, FileText, DollarSign, CheckCircle, Shield, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { useSendMoneyForm, Client } from './hooks/useSendMoneyForm';
// Original components
import { TransferDetails } from './components/TransferDetails';
import { AmountEntry } from './components/AmountEntry';
import { ConfirmationStep } from './components/ConfirmationStep';
import { ProgressIndicator } from './components/ProgressIndicator';
import { SenderTransactionHistoryModal, Transaction } from './components/SenderTransactionHistoryModal';
import { ReceiverDetailsModal } from './components/ReceiverDetailsModal';
import { ReceiverTransactionHistoryModal } from './components/ReceiverTransactionHistoryModal';
// New Apple-styled components
import AppleSenderSelection from './components/apple/SenderSelection';
import AppleSenderProfilePage from './components/apple/AppleSenderProfilePage';
import AppleReceiverSelectionPage from './components/apple/AppleReceiverSelectionPage';
import { AppleReceiverProfilePage } from './components/apple/AppleReceiverProfilePage';
import { AppleNewReceiverForm } from './components/apple/AppleNewReceiverForm';
import { AppleRecentReceiversModal } from './components/apple/AppleRecentReceiversModal';
import { Receiver } from '@/types/receiver';
// Import NewSenderForm for step 1
import { NewSenderForm } from './components/NewSenderForm';
import { useNewReceiverNavigation } from './hooks/useNewReceiverNavigation';

// Define step interfaces
interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function SendMoneyPage() {
  // State for managing Apple-style UI views
  const [showDetailedSenderProfile, setShowDetailedSenderProfile] = useState(false);
  const [showReceiverProfilePage, setShowReceiverProfilePage] = useState(false);
  
  // Custom hook for handling new receiver navigation
  const { handleNavigateToNewReceiver } = useNewReceiverNavigation();
  
  const {
    steps: formSteps,
    activeStep,
    navigationDirection,
    transferComplete,
    showSuccessMessage,
    isSubmitting,
    initialLoading,
    errors,
    searchQuery,
    setSearchQuery,
    selectedSender,
    setSelectedSender,
    selectedReceiver,
    setSelectedReceiver,
    showNewSenderForm,
    setShowNewSenderForm,
    showNewReceiverForm,
    setShowNewReceiverForm,
    formData,
    setFormData,
    filteredClients,
    handleNavigation,
    canProceed,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    calculateFee,
    calculateRecipientAmount,
    calculateTotalAmount,
    handleSendAnother,
    transferLimits,
    transferErrors,
    retryCount,
    isHighRiskTransaction,
    requires2FA,
    is2FAVerified,
    verify2FA,
    handleSaveSender,
    handleSaveReceiver,
    historyModalSender,
    senderTransactions,
    isLoadingHistory,
    handleShowSenderHistory,
    handleCloseSenderHistoryModal,
    handleUseTransactionFromHistory,
    handleSetReceiverSameAsSender,
    handleUseGlobalRemitProduct,
    handleSubmit: formSubmitHandler,
    showRecentReceiversModal,
    recentReceivers,
    isLoadingRecentReceivers,
    handleCloseRecentReceiversModal,
    handleSelectReceiverFromRecent,
    showReceiverDetailsModal,
    selectedReceiverForDetails,
    handleOpenReceiverDetailsModal,
    handleCloseReceiverDetailsModal,
    showReceiverHistoryModal,
    selectedReceiverForHistory,
    receiverTransactions,
    isLoadingReceiverHistory,
    handleOpenReceiverHistoryModal,
    handleCloseReceiverHistoryModal,
    handleGoToStep,
    handleShowRecentReceiversModal,
  } = useSendMoneyForm();
  
  // Define our steps with icons and colors
  const steps: Step[] = [
    { 
      id: 1, 
      title: 'Sender', 
      icon: <User className="h-5 w-5" />, 
      color: 'bg-blue-500',
      description: 'Select who is sending the money'
    },
    { 
      id: 2, 
      title: 'Receiver', 
      icon: <Users className="h-5 w-5" />, 
      color: 'bg-green-500',
      description: 'Select who will receive the money'
    },
    { 
      id: 3, 
      title: 'Details', 
      icon: <FileText className="h-5 w-5" />, 
      color: 'bg-purple-500',
      description: 'Provide details about your transfer'
    },
    { 
      id: 4, 
      title: 'Amount', 
      icon: <DollarSign className="h-5 w-5" />, 
      color: 'bg-amber-500',
      description: 'Enter the amount you want to send'
    },
    { 
      id: 5, 
      title: 'Confirm', 
      icon: <CheckCircle className="h-5 w-5" />, 
      color: 'bg-emerald-500',
      description: 'Review and confirm your transfer details'
    }
  ];
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate progress percentage
  const progressPercentage = Math.round((activeStep / steps.length) * 100);
  
  // Add event listener for form submission from ConfirmationStep
  useEffect(() => {
    const handleFormSubmit = () => {
      if (activeStep === 5 && formData.agreeToTerms && !isSubmitting) {
        // Trigger the next step navigation which will call handleSubmit() in the hook
        handleNavigation('next');
      }
    };
    
    window.addEventListener('submit-form', handleFormSubmit);
    return () => window.removeEventListener('submit-form', handleFormSubmit);
  }, [activeStep, formData.agreeToTerms, isSubmitting, handleNavigation]);
  
  // Render the current step content
  const renderStepContent = () => {
    if (showNewSenderForm && activeStep === 1) {
      return (
        <NewSenderForm 
          onSave={(data) => {
            handleSaveSender(data);
          }}
          onCancel={() => setShowNewSenderForm(false)}
        />
      );
    } else if (showNewReceiverForm && activeStep === 2) {
      return (
        <AppleNewReceiverForm
          selectedSender={selectedSender}
          onBack={() => {
            setShowNewReceiverForm(false);
          }}
          onSave={(data) => {
            handleSaveReceiver(data);
            // After saving, return to receiver selection
            setShowNewReceiverForm(false);
          }}
          onCancel={() => setShowNewReceiverForm(false)}
        />
      );
    }

    // If we're showing the receiver profile, render it over other steps
    if (showReceiverProfilePage && selectedReceiver && selectedSender) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="receiver-detailed-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <AppleReceiverProfilePage 
              receiver={selectedReceiver}
              selectedSender={selectedSender}
              onBack={() => {
                // Return to sender profile view instead of receiver selection
                setShowReceiverProfilePage(false);
                // Hide the recent receivers modal
                handleCloseRecentReceiversModal();
                // Show the sender profile
                setShowDetailedSenderProfile(true);
              }}
              onEdit={() => {
                // Show edit form for the receiver
                setShowReceiverProfilePage(false);
                setShowNewReceiverForm(true);
              }}
              onAddNewReceiver={() => {
                setShowReceiverProfilePage(false);
                setSelectedReceiver(null); // Clear selected receiver
                setShowNewReceiverForm(true);
              }}
              onContinue={() => {
                // Hide the receiver profile
                setShowReceiverProfilePage(false);
                
                // Hide the detailed sender profile if it's showing
                setShowDetailedSenderProfile(false);
                
                // Navigate directly to the next step (Details/Amount)
                handleGoToStep(3); // Step 3 is the Details step
              }}
            />
          </motion.div>
        </AnimatePresence>
      );
    }

    // If we're showing the detailed sender profile, render it over the standard steps
    if (showDetailedSenderProfile && selectedSender) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="sender-detailed-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {/* Sender detailed profile with built-in navigation */}
            <AppleSenderProfilePage 
              senderId={selectedSender.id} 
              onBack={() => setShowDetailedSenderProfile(false)}
              onContinue={() => {
                // Keep the sender profile in the background state when showing receivers
                // Show recent receivers modal when continuing from sender profile
                handleShowRecentReceiversModal();
              }}
            />
          </motion.div>
        </AnimatePresence>
      );
    }

    switch (activeStep) {
      case 1:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="sender-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Use Apple-styled sender selection */}
              <AppleSenderSelection
                initialLoading={initialLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredClients={filteredClients}
                selectedSender={selectedSender}
                setSelectedSender={setSelectedSender}
                setShowNewSenderForm={setShowNewSenderForm}
                onViewHistory={handleShowSenderHistory}
                showDetailedProfile={showDetailedSenderProfile}
                setShowDetailedProfile={setShowDetailedSenderProfile}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 2:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="receiver-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AppleReceiverSelectionPage
                filteredReceivers={filteredClients.map(c => ({...c, id: c.id || Math.random().toString() }))}  
                selectedReceiver={selectedReceiver}
                // Use type assertion to handle the different Client interfaces
                setSelectedReceiver={(client) => setSelectedReceiver(client as any)}
                selectedSender={selectedSender || {} as any}
                onAddNewReceiver={() => setShowNewReceiverForm(true)}
                onBack={() => {
                  // When going back, if we came from sender profile, go back to it
                  if (showDetailedSenderProfile) {
                    // Maintain sender profile state
                  } else {
                    // Otherwise go back to sender selection step
                    handleNavigation('back');
                  }
                }}
                onBackToSenderSearch={() => handleNavigation('back')}
                onContinue={() => {
                  if (selectedReceiver) {
                    handleNavigation('next');
                  }
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={initialLoading}
                onShowReceiverDetails={(client) => {
                  // Show the Apple-style receiver profile page
                  setSelectedReceiver(client as any);
                  setShowReceiverProfilePage(true);
                }}
                onShowReceiverHistory={(receiverId: string) => {
                  // Find the receiver and show their history
                  let receiverToViewHistory = recentReceivers.find(r => r.id === receiverId);
                  if (!receiverToViewHistory) {
                    const clientForHistory = filteredClients.find(c => c.id === receiverId);
                    if (clientForHistory) {
                      receiverToViewHistory = {
                        id: clientForHistory.id || 'temp-id',
                        firstName: clientForHistory.firstName,
                        lastName: clientForHistory.lastName,
                        phone: clientForHistory.phone,
                        email: clientForHistory.email,
                        country: clientForHistory.country,
                      };
                      handleOpenReceiverHistoryModal(receiverToViewHistory as any);
                    }
                  } else {
                    handleOpenReceiverHistoryModal(receiverToViewHistory);
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>
        );
      case 3:
        return (
          <TransferDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <AmountEntry
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            calculatedFee={formData.fee || '0.00'}
            calculatedRecipientAmount={formData.recipientAmount || '0.00'}
            calculatedTotalAmount={formData.totalAmount || '0.00'}
            errors={errors}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            formData={formData}
            selectedSender={selectedSender}
            selectedReceiver={selectedReceiver}
            handleCheckboxChange={handleCheckboxChange}
            isSubmitting={isSubmitting}
            errors={errors}
            transferComplete={transferComplete}
            handleSendAnother={handleSendAnother}
            calculateFee={calculateFee}
            calculateRecipientAmount={calculateRecipientAmount}
            calculateTotalAmount={calculateTotalAmount}
            onFinalSubmit={formSubmitHandler}
            transferErrors={transferErrors}
            isHighRiskTransaction={isHighRiskTransaction}
            requires2FA={requires2FA}
            is2FAVerified={is2FAVerified}
            verify2FA={verify2FA}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      
      {/* Enhanced Progress bar - iOS Style */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 w-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600" 
          initial={{ width: 0, x: -20 }}
          animate={{ width: `${progressPercentage}%`, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
          }}
        />
      </div>
      
      {/* Main content - Regular scrolling behavior */}
      <main className="container mx-auto px-4 py-4 pb-16 flex flex-col lg:flex-row lg:gap-6 lg:items-start">
        {isLoading || initialLoading ? (
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mx-auto"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col max-w-7xl mx-auto w-full">
            {/* Horizontal Progress Indicator - iOS Style */}
            <div className="mb-6">
              <ProgressIndicator steps={steps} activeStep={activeStep} />
            </div>
            
            {/* Step content */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8">
                
                {/* Render the active step component */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeStep + (showNewSenderForm ? '_nsf' : '') + (showNewReceiverForm ? '_nrf' : '')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {activeStep > 1 && (
                  <Button
                    onClick={() => handleNavigation('back')}
                    variant="outline"
                    className="rounded-xl border-gray-300 dark:border-gray-700 order-2 sm:order-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                
                {(!transferComplete && activeStep > 0 && activeStep <= steps.length && !showDetailedSenderProfile) && (
                  <motion.div
                    whileHover={{ scale: canProceed() ? 1.01 : 1 }}
                    whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                    className="order-1 sm:order-2"
                  >
                    <Button
                      onClick={() => handleNavigation('next')}
                      className={cn(
                        "rounded-xl w-full sm:w-auto",
                        !canProceed() ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" :
                        "bg-blue-500 hover:bg-blue-600 text-white"
                      )}
                      disabled={!canProceed() || isSubmitting}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Success Message Overlay */}
      <AnimatePresence>
        {showSuccessMessage && (
          <ConfettiSuccess
            message="Transfer Successful!"
            description={`Your money transfer has been processed successfully.`}
            actionLabel="Go to Dashboard"
            onActionClick={() => window.location.href = '/dashboard'}
            onSendAnother={handleSendAnother}
            amount={formData.amount}
            currency={formData.currency || '$'}
            receiverName={selectedReceiver?.name || 'Recipient'}
          />
        )}
      </AnimatePresence>

      {/* Sender Transaction History Modal */}
      <SenderTransactionHistoryModal
        isOpen={!!historyModalSender}
        onClose={handleCloseSenderHistoryModal}
        sender={historyModalSender}
        transactions={senderTransactions}
        isLoading={isLoadingHistory}
        onUseTransaction={handleUseTransactionFromHistory}
        onAddNewReceiver={() => {
          // First explicitly close the modal
          handleCloseSenderHistoryModal();
          
          // Then reset the search query
          setSearchQuery('');
          
          // Navigate to receiver step (step 2)
          handleGoToStep(2);
          
          // Finally show the new receiver form
          // Adding a small delay to ensure state updates have propagated
          setTimeout(() => {
            setShowNewReceiverForm(true);
          }, 10);
        }}
      />
      
      {/* Modals */}
      <AnimatePresence>
        {showRecentReceiversModal && selectedSender && (
          <AppleRecentReceiversModal 
            isOpen={showRecentReceiversModal}
            onClose={() => {
              // When closing the recent receivers modal, just close it without changing step
              // This allows us to stay on the sender profile but close the modal
              handleCloseRecentReceiversModal();
              
              // Explicitly navigate to receiver selection
              handleGoToStep(2);
            }}
            receivers={recentReceivers}
            selectedSenderName={selectedSender ? `${selectedSender.firstName} ${selectedSender.lastName}` : ''}
            isLoading={isLoadingRecentReceivers}
            onSelectReceiver={(receiver) => {
              // Create a compatible client object from receiver
              const clientReceiver = {
                id: receiver.id,
                firstName: receiver.firstName,
                lastName: receiver.lastName,
                email: receiver.email,
                phone: receiver.phone,
                country: receiver.country,
                city: receiver.city,
                streetAddress: receiver.streetAddress
              };
              
              // Pass this client-compatible object to the handler
              handleSelectReceiverFromRecent(clientReceiver as any);
              handleCloseRecentReceiversModal();
              
              // Show the receiver profile directly
              setShowReceiverProfilePage(true);
            }}
            onShowReceiverDetails={(receiver: any) => {
              handleCloseRecentReceiversModal();
              
              // Use type assertion to override type safety - in a real app we'd implement proper type conversion
              // This works because the actual shape of the objects is compatible for our navigation purposes
              setSelectedReceiver(receiver as any);
              
              // Show receiver profile page
              setShowReceiverProfilePage(true);
            }}
            onShowReceiverHistory={(receiverId: any) => {
              const receiver = recentReceivers.find(r => r.id === receiverId);
              if (receiver) {
                handleOpenReceiverHistoryModal(receiver);
              }
            }}
            onAddNewReceiver={() => {
                // Use the centralized navigation handler
                handleNavigateToNewReceiver(
                  handleCloseRecentReceiversModal,
                  setShowNewReceiverForm,
                  setSearchQuery,
                  handleGoToStep
                );
            }}
            onSearchReceiver={() => {
                // Close modal and show receiver selection with search focus
                handleCloseRecentReceiversModal();
                // TODO: Add logic to focus on search field
                // For now, just showing the receiver selection is sufficient
            }}
          />
        )}

        {showReceiverDetailsModal && selectedReceiverForDetails && (
          <ReceiverDetailsModal
            isOpen={showReceiverDetailsModal}
            onClose={handleCloseReceiverDetailsModal}
            receiver={selectedReceiverForDetails}
          />
        )}

        {showReceiverHistoryModal && selectedReceiverForHistory && (
          <ReceiverTransactionHistoryModal
            isOpen={showReceiverHistoryModal}
            onClose={handleCloseReceiverHistoryModal}
            receiver={selectedReceiverForHistory}
            transactions={receiverTransactions}
            isLoading={isLoadingReceiverHistory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

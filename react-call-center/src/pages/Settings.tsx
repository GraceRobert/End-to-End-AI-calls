import { useState, useEffect } from "react"
import { Save } from "lucide-react"
import { useSettings, useUpdateSettings } from "../hooks/useApi"

const Settings = () => {
  const {
    data: initialSettings,
    loading: settingsLoading,
    error: settingsError,
  } = useSettings()
  const {
    mutate: updateSettings,
    loading: saveLoading,
    error: saveError,
  } = useUpdateSettings()
  const [settings, setSettings] = useState({
    callCentreName: "",
    callCentreDescription: "",
    defaultLanguage: "",
    defaultVoice: "",
    defaultGreeting: "",
    crmIntegrationKey: "",
  })
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Update local state when API data loads
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      await updateSettings(settings)
      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      setSaveMessage("Failed to save settings. Please try again.")
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Show loading state
  if (settingsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your call center preferences and integrations
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (settingsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your call center preferences and integrations
          </p>
        </div>
        <div className="card">
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Settings
            </h3>
            <p className="text-gray-600 mb-4">{settingsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your call center preferences and integrations
        </p>
      </div>

      <div className="max-w-4xl">
        {/* General Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Centre Name
              </label>
              <input
                type="text"
                value={settings.callCentreName}
                onChange={(e) =>
                  handleInputChange("callCentreName", e.target.value)
                }
                className="input-field"
                placeholder="Enter call centre name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Centre Description
              </label>
              <input
                type="text"
                value={settings.callCentreDescription}
                onChange={(e) =>
                  handleInputChange("callCentreDescription", e.target.value)
                }
                className="input-field"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Call Handling Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Call Handling
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <input
                type="text"
                value={settings.defaultLanguage}
                onChange={(e) =>
                  handleInputChange("defaultLanguage", e.target.value)
                }
                className="input-field"
                placeholder="e.g., English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Voice
              </label>
              <input
                type="text"
                value={settings.defaultVoice}
                onChange={(e) =>
                  handleInputChange("defaultVoice", e.target.value)
                }
                className="input-field"
                placeholder="e.g., en-US-Standard-A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Greeting
              </label>
              <input
                type="text"
                value={settings.defaultGreeting}
                onChange={(e) =>
                  handleInputChange("defaultGreeting", e.target.value)
                }
                className="input-field"
                placeholder="e.g., Hello, how can I help you?"
              />
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Integration
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CRM Integration Key
            </label>
            <input
              type="password"
              value={settings.crmIntegrationKey}
              onChange={(e) =>
                handleInputChange("crmIntegrationKey", e.target.value)
              }
              className="input-field"
              placeholder="Enter CRM integration key"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center space-x-4">
          {saveMessage && (
            <div
              className={`text-sm ${
                saveMessage.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings

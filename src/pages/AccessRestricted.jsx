import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const AccessRestricted = () => {
  const handleSwitchAccount = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <FontAwesomeIcon icon={faLock} className="text-6xl text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          You dont have permission to access.
        </p>
        <p className="text-gray-600 mb-6">
          Please contact the owner and ask to invite you to this link, or switch
          accounts.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          onClick={handleSwitchAccount}
        >
          Switch Accounts
        </button>
      </div>
    </div>
  );
};

export default AccessRestricted;

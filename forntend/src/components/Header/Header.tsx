import { useAuth } from "../../context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        width: "100%",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #e5e7eb",
        background: "#ea1e1e",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT TITLE */}
        <h2 style={{ margin: 0, fontSize: "18px" }}>Social Media App</h2>

        {/* RIGHT USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {user && (
            <>
              {/* PROFILE IMAGE */}
              <img
                src={
                  user.profilePicture ||
                  "https://www.gravatar.com/avatar/?d=mphttps://images.unsplash.com/photo-1708024587407-73445142b5a8?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3MXx0b3dKWkZza3BHZ3x8ZW58MHx8fHx8"
                }
                alt="profile"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />

              {/* NAME */}
              <span style={{ fontWeight: 500 }}>{user.name}</span>

              {/* LOGOUT */}
              <button
                onClick={logout}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

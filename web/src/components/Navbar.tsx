import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container flex items-center justify-between py-3" style={{ display: "flex" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: "#4f46e5", color: "#fff", display: "grid", placeItems: "center" }}>
            +
          </span>
          Klinic Pro
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          {user ? (
            <>
              <Link to="/mis-citas">Mis citas</Link>
              {user.role !== "patient" && <Link to="/admin">Panel Staff</Link>}
              <Link to="/perfil" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#e2e8f0",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 14,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="muted">{user.name.split(" ")[0]}</span>
              </Link>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/reservar" className="btn btn-primary">
                Reservar
              </Link>
              <Link to="/login" className="btn btn-ghost">
                Entrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

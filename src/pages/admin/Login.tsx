import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import { Lock } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            navigate("/admin/dashboard"); 
        } catch (err) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div className="min-h-screen bg-brand-light/20 flex items-center justify-center font-body">
            <SEO title="Ingreso Administrador" description="Acceso al panel" />
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-brand-light/30">
                <div className="flex justify-center mb-8">
                    <div className="bg-brand-light/20 p-5 rounded-full">
                        <Lock className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <h2 className="text-3xl font-display text-center text-brand-dark mb-8">Acceso Administrador</h2>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Usuario</label>
                        <input 
                            type="text" 
                            className="w-full border border-brand-light rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full border border-brand-light rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary transition shadow-xl tracking-widest text-sm">
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
};
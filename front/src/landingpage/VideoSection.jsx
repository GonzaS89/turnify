import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaPlay } from "react-icons/fa6"; // Usamos Fa6 para un look más tech

const VideoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const youtubeLink = "https://www.youtube.com/watch?v=tTBl4CSIaLY";

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden bg-white">
      {/* --- EFECTO DE LUZ AMBIENTAL (Glow Sync) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Badge Minimalista */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Product Tour
          </motion.div>

          {/* Título de alto impacto */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            La salud, en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
              pantalla completa.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl font-medium"
          >
            Descubrí la fluidez de Turnate. Una plataforma diseñada para que tu única preocupación sea el paciente.
          </motion.p>

          {/* --- VIDEO PLAYER CONTAINER --- */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl mt-10 group"
          >
            {/* Marco de "Cristal" del reproductor */}
            <div className="relative aspect-video rounded-[2.5rem] p-2 bg-gradient-to-b from-slate-200 to-transparent border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden">
              
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-slate-900 group">
                
                {/* Overlay Gradiente de Imagen de fondo (Simulada) */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60" 
                     style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')` }} 
                />
                
                {/* Botón Play Estilo 2026 */}
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center group/btn"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Anillos de expansión animados */}
                    <div className="absolute inset-0 w-24 h-24 bg-white/20 rounded-full animate-ping group-hover/btn:bg-white/40 transition-colors" />
                    
                    {/* Cuerpo del botón */}
                    <div className="relative w-24 h-24 bg-white backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:rotate-[360deg]">
                      <FaPlay className="text-slate-900 text-2xl ml-1" />
                    </div>
                  </div>
                </a>

                {/* Etiquetas flotantes sobre el video */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 uppercase">
                    4K HDR
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase">
                    New Update
                  </span>
                </div>
              </div>
            </div>

            {/* Efecto de sombra de color proyectada debajo del video */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-indigo-600/30 blur-[60px] -z-10 group-hover:bg-indigo-600/50 transition-colors" />
          </motion.div>

          {/* Stats rápidos debajo del video */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-12 pt-8 border-t border-slate-100"
          >
            {[
              { label: "Duración", value: "2:45 min" },
              { label: "Calidad", value: "Ultra HD" },
              { label: "Actualizado", value: "Feb 2026" },
              { label: "Vistas", value: "+15k" },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{stat.label}</p>
                <p className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
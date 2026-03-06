import { FileText, Upload, Download, Search, FolderOpen } from 'lucide-react';

const MOCK_DOCS = [
  { id: 1, name: 'Ordenanza Municipal N°045-2026', type: 'PDF', size: '2.4 MB', date: '2026-03-01', category: 'Ordenanzas' },
  { id: 2, name: 'Resolución de Alcaldía N°012', type: 'PDF', size: '1.1 MB', date: '2026-02-22', category: 'Resoluciones' },
  { id: 3, name: 'Plan de Desarrollo Concertado 2025-2030', type: 'PDF', size: '8.7 MB', date: '2026-02-10', category: 'Planificación' },
  { id: 4, name: 'Presupuesto Institucional 2026', type: 'XLSX', size: '3.2 MB', date: '2026-01-15', category: 'Presupuesto' },
];

export default function ManageDocuments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Gestionar Documentos</h1>
          <p className="text-gray-500 text-sm mt-1">{MOCK_DOCS.length} documentos disponibles</p>
        </div>
        <button id="upload-doc-btn" className="btn-primary text-sm">
          <Upload size={16} strokeWidth={2} />
          Subir Documento
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="doc-search"
            type="text"
            placeholder="Buscar documento..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-marcona-blue/30 focus:border-marcona-blue transition"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Nombre</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Categoría</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Tamaño</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Fecha</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_DOCS.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText size={15} strokeWidth={1.5} className="text-red-500" />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-marcona-light text-marcona-blue text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">{doc.type}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{doc.size}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{doc.date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Descargar">
                        <Download size={15} strokeWidth={1.5} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Ver">
                        <FolderOpen size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import {
  User,
  GraduationCap,
  Mail,
  Github,
  FileText,
  Code,
  CheckCircle2,
  Link as LinkIcon } from
'lucide-react';
export function Profile() {
  return (
    <div className="h-full flex flex-col p-4 gap-4 max-w-[1400px] mx-auto w-full">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-shrink-0">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-slate-800 border-4 border-white overflow-hidden">
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 pb-4 text-center px-6">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Nguyễn Mạnh Đức</h1>
          <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full">
            B22DCPT061 • D22CQPT01
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Personal Info */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wide flex-shrink-0">
            <User className="w-3.5 h-3.5" />
            Thông tin cá nhân
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between flex-1">
            {[
              { icon: User, label: 'Họ và tên', value: 'Nguyễn Mạnh Đức' },
              { icon: GraduationCap, label: 'Mã sinh viên', value: 'B22DCPT061' },
              { icon: GraduationCap, label: 'Lớp', value: 'D22CQPT01' },
              { icon: Mail, label: 'Email', value: 'nduc8868x@gmail.com' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Docs */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wide flex-shrink-0">
            <LinkIcon className="w-3.5 h-3.5" />
            Tài liệu đồ án
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {[
              { icon: Github, title: 'Mã nguồn', desc: 'Kho lưu trữ Frontend & Backend' },
              { icon: FileText, title: 'Báo cáo đồ án', desc: 'Tài liệu báo cáo chi tiết' },
              { icon: Code, title: 'Tài liệu API', desc: 'Chi tiết các Endpoint & Model' },
            ].map(({ icon: Icon, title, desc }) => (
              <a
                key={title}
                href="#"
                className="flex-1 flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-700 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                <LinkIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

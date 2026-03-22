import EvaluasiSikapTable from "src/components/tables/EvaluasiTable";

interface PenilaianKaryawanProps {
    periodeId?: number;
}

const PenilaianKaryawan: React.FC<PenilaianKaryawanProps> = ({ periodeId }) => {
    return (
        <div>
            {/* Teruskan periodeId ke komponen tabel */}
            <EvaluasiSikapTable periodeId={periodeId} />
        </div>
    );
};

export default PenilaianKaryawan;
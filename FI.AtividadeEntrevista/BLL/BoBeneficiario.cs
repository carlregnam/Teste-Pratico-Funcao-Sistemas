using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public void Incluir(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario dao = new DAL.DaoBeneficiario();
            dao.Incluir(beneficiario);
        }
        public List<DML.Beneficiario> Listar(long idCliente)
        {
            DAL.DaoBeneficiario dao = new DAL.DaoBeneficiario();
            return dao.Pesquisa(idCliente);
        }

        public void Excluir(long idCliente)
        {
            DAL.DaoBeneficiario dao = new DAL.DaoBeneficiario();
            dao.Excluir(idCliente);
        }
    }
}
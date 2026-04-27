using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long ID { get; set; }
        
        public string CPF { get; set; }

        public string Nome { get; set; }

        public long IDCLIENTE { get; set; }

    }
}

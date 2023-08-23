using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "O campo {0} precisa ter de 3 a 50 caracteres.")]
        public string Tema { get; set; }

        [Range(1, 120000, ErrorMessage = "{0} não pode ser menor que 1 e maior que 120000.")]
        public int QtdPessoas { get; set; } 
        
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp, ou png)")]
        public string ImagemURL { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [Phone(ErrorMessage = "O campo {0} está com núemro inválido.")]
        public string Telefone { get; set; }

        [Display(Name = "E-mail")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [EmailAddress(ErrorMessage = "O campo {0} não é um e-mail válido.")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}
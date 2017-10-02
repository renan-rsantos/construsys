<?php


namespace App\Http\Models\Cadastros;

use App\Http\Models\Model;

/**
 * Description of Cliente
 *
 * @author Renan Rodrigues
 */
class Cliente extends Model{
    
    protected $fillable = [
        'idcliente','idpessoa',
    ];
    

	public $consulta = ['visible'=>'idcliente,pesnome,pescpfcnpj',
        'search'=>'pesnome,pescpfcnpj',
        'text'=>'pesnome',
        'label'=>'Cliente',
        'objetos'=>['pesnome'=>'pessoa','pescpfcnpj'=>'pessoa']
    ];

    public function pessoa(){
        return $this->belongsTo(Pessoa::class,'idpessoa','idpessoa');
    }
}

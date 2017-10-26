<?php

namespace App\Http\Models\Obras;

use App\Http\Models\Model;
/**
 * Description of Fase
 *
 * @author Renan Rodrigues
 */
class Fase extends Model{
    protected $fillable = [
        'fsedescricao',
    ];
    
    public static function getFases(){
        $fases = [''=>''];
        foreach(self::all() as $fase){
            $fases[$fase->idfase] = $fase->fsedescricao;
        }
        return $fases;
    }    
}

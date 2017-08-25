<?php

namespace App\Html;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Auth;

class HtmlBuilder extends \Collective\Html\HtmlBuilder{

    public function link($url, $title = null, $attributes = array(), $secure = null, $escape = false) {
        if(isset($attributes['icon'])){
            $title = $attributes['icon'] . $title;
            unset($attributes['icon']);
        }
        return parent::link($url, trim($title), $attributes, $secure, $escape);
    }
    public function icon($icon,$title = '&nbsp;'){
        return $this->toHtmlString('<i class="'.$icon.'">'.$title.'</i>');
//        return $this->tag('i',$title,['class'=>$icon]);
    }
    
    protected function li($value,$attributes = array()){
        return $this->toHtmlString('<li '.$this->attributes($attributes).'>'.$value.'</li>');
    }
    
    protected function listingElement($key, $type, $value) {
        if (is_array($value)) {
            if(isset($value['value'])){
                $attributes = isset($value['attributes']) ? $value['attributes'] : [];
                $value = $value['value'];
                return $this->li($value,$attributes);
            }
            return $this->nestedListing($key, $type, $value);
        } else {
            return $this->li($value);
        }
    }

    public function panel($header = '',$body = array(),$footer = '', $attributes = array()){
        $divHeader = '';
        $divBody = '';
        $divFooter = '';
        if($header){
            $divHeader = $this->tag('div', $this->tag('h3',$header),['class'=>'panel-heading text-center']);
        }
        if($body){
            $html = '';
            foreach($body as $element){
                $html .= ($element instanceof HtmlString) ? $element->toHtml() : $element;
            }
            $divBody = $this->tag('div', $html,['class'=>'panel-body']);
        }
        if($footer){
            $divFooter = $this->tag('div', $this->tag('small',$footer),['class'=>'panel-footer']);
        }
        if(!isset($attributes['color'])){
            $attributes['color'] = 'default';
        }
        $this->addClassAttributes($attributes, 'panel panel-'.$attributes['color']);
        return $this->tag('div', $divHeader . $divBody . $divFooter,$attributes);
    }
    
    public function listGroup($list = array() , $type = 'default',$attributes = []){
        if(count($list) == 0){
            return '';
        }
        foreach($list as $item){
            $listContent[] = ['value'=>$item , 'attributes'=>['class'=>'list-group-item list-group-item-'.$type]];
        }
        $this->addClassAttributes($attributes, 'list-group');
        return $this->ul($listContent,$attributes);
    }
    
    public function tag($tag, $content, array $attributes = array()) {
        if($content instanceof HtmlString){
            $content = $content->toHtml();
        }
        return parent::tag($tag, $content, $attributes);
    }

    public function addClassAttributes(&$attributes,string $class,$substitute = false){
        if($substitute){
            $attributes['class'] = $class;
            return $attributes;
        }
        $classAux = '';
        if(isset($attributes['class'])){
            $classAux = $attributes['class'];
        }
        $attributes['class'] = trim($class.' '.$classAux);
//        return $attributes;
    }
    
    public function navBar($id, $brand = '', $content = [],$attributes = []){
        $this->addClassAttributes($attributes, 'navbar navbar-default');
        $btnToggle = $this->tag('button',
                $this->tag('span','Toggle navigation',['class'=>'sr-only']).
                $this->tag('span','',['class'=>'icon-bar']).
                $this->tag('span','',['class'=>'icon-bar']).
                $this->tag('span','',['class'=>'icon-bar']),
                    [
                        'class'=>'navbar-toggle collapsed',
                        'data-toggle'=>'collapse',
                        'data-target'=>"#$id", 
                        'aria-expanded'=>'false'
                    ]);
        $contentNavBar = '';
        foreach ($content as $element) {
            $contentNavBar .= ($element instanceof HtmlString) ? $element->toHtml() : $element;
        }
        if($brand == ''){
            $brand = $this->tag('a','&nbsp;',['class'=>'navbar-brand']);
        }
        $divHeader = $this->tag('div',$btnToggle . $brand,['class'=>'navbar-header']);
        $divNavBar = $this->tag('div', $contentNavBar,['class'=>'collapse navbar-collapse', 'id'=>$id]);
        return $this->tag('nav', $divHeader . $divNavBar,$attributes);
    }
    
    public function navBarBottom($id, $brand = '', $content = [],$attributes = []){
        $this->addClassAttributes($attributes, 'navbar-fixed-bottom');
        return $this->navBar($id,$brand,$content,$attributes);
    }
    
    public function navBarTop($id, $brand = '', $content = [],$attributes = []){
        $this->addClassAttributes($attributes, 'navbar-fixed-top');        
        return $this->navBar($id,$brand,$content,$attributes);
    }

    public function nav($items = [], $attributes = [], $pullRight = false){
        if(count($items) == 0){
            return '';
        }
        if($pullRight){
            $this->addClassAttributes($attributes, 'navbar-right');
        }
        $this->addClassAttributes($attributes, 'nav navbar-nav');
        $contentItems = '';
        foreach ($items as $item){
            $contentItems .= $item;
        }
        return $this->tag('ul',$contentItems,$attributes);
    }
    
    public function navTabs($tabs = [] , $attributes = []){
        $htmlHeader = "";
        $htmlBody = "";
        $i = 0;
        foreach ($tabs as $tab) {
            $active = ($i===0) ? "active" : "";
            $tabActve = ($i===0) ? "tab-pane fade in active" : "tab-pane fade";
            $i=1;
            $htmlHeader.= $this->tag('li', $this->tag('a', $tab['label'],
                    ['href'=>'#'.$tab['link'],
                     'data-toggle'=>'tab']),
                    ["class"=>$active]);
            
            $htmlBody .= $this->tag('div', $tab['tab'],['class'=>$tabActve,'id'=>$tab['link']]);
        }
        $this->addClassAttributes($attributes, "nav nav-tabs");
        $header = $this->tag('ul',$htmlHeader,$attributes);
        $body = $this->tag('div', $htmlBody,['class'=>'tab-content']);
        return $this->toHtmlString($header . '<br/>' . $body);
    }
    
    public function navItem($url,$title,$attributes = []){
        $attributesLink = $attributes;
        $item = $this->link($url,$title,$attributesLink);
        if(isset($attributes['icon'])){
            unset($attributes['icon']);
        }
        return $this->li($item,$attributes);
    }
    
    public function navItemDropDown($item,  $dropDownItems = [], $dropup = false, $attributes = [],$useCaret = true,$brand = false){
        $caret = ($useCaret) ? ' '.$this->tag('span','',['class'=>'caret']) : '';
        $classBrand = ($brand) ? 'navbar-brand ' : '';
        
        $disabled = isset($attributes['disabled']) ? ' disabled' : '';
        $item = $this->tag('a',$item . $caret,[$disabled,'class'=>$classBrand.'dropdown-toggle'.$disabled, 'data-toggle'=>'dropdown','role'=>'button', 'aria-haspopup'=>'true', 'aria-expanded'=>'false']);
        if($dropup){
            $this->addClassAttributes($attributes, 'dropup');
        }
        $items = '';
        foreach ($dropDownItems as $dropDownItem) {
            $items .= $dropDownItem;
        }
        $dropDownMenu = $this->tag('ul', $items,['class'=>'dropdown-menu']);
        $this->addClassAttributes($attributes, 'dropdown');
        $this->addClassAttributes($attributes, $disabled);
        if($brand){
            return $this->toHtmlString($item . $dropDownMenu);
        }
        return $this->tag('li',$item . $dropDownMenu,$attributes);
    }

    public function dropDownItem($url,$title,$attributes = array()){
        return $this->li($this->link($url,$title,$attributes,null,false));
    }
    
    public function dropDownDivider(){
        return $this->li('',['role'=>'separator','class'=>'divider']);
    }
    
    public function userMenu(){
        if(!Auth::check()){
            return '';
        }
        $user = Auth::user()->pessoa->pesnome;
        $length = (strpos($user,' ') > 0) ? strpos($user,' ') : strlen($user);
        $user = $this->icon('fa fa-user').substr($user, 0, $length).' ['.Auth::user()->usulogin.']';
        $dropDownItems[] = $this->dropDownItem(url('/preferences'),$this->icon('fa fa-cogs').'Preferências');
        $dropDownItems[] = $this->dropDownDivider();
        $dropDownItems[] = $this->dropDownItem(url('/logout'),$this->icon('fa fa-sign-out').'Sair');
        return $this->nav([$this->navItemDropDown($user, $dropDownItems),$this->li($this->nbsp(2))],[],true);
    }
    
    public function column($name,$title,$type = 'text',$grupo = '',$width = 0){
        $column = ['data'=>$name,'title'=>$title,'type'=>$type,'width'=>$width];
        if($grupo){
            $column['grupo'] = $grupo;
        }
        return $column;
    }
    
    public function getTableHeader($columns){
        $rowspanDef = 1;
        $colSpanGrupo = [];
        foreach ($columns as $column){
            if(isset($column['grupo'])){
                $rowspanDef = 2;
                if(!isset($colSpanGrupo[$column['grupo']])){
                    $colSpanGrupo[$column['grupo']] = 0;
                }
                $colSpanGrupo[$column['grupo']]++;
            }
        }
        foreach ($columns as $column){
            $rowspan = (isset($column['grupo'])) ? 1 : $rowspanDef;
            $attributes = ['class'=>'text-center','rowspan'=>$rowspan,'data'=>$column['data'],'width'=>$column['width']];
            if(isset($column['grupo'])){
                $ths2[] = $this->tag('th',$column['title'],$attributes)->toHtml();
                if(isset($colSpanGrupo[$column['grupo']])){
                    $attributes['colspan'] = $colSpanGrupo[$column['grupo']];
                    $ths1[] = $this->tag('th', $column['grupo'],$attributes)->toHtml();
                    unset($colSpanGrupo[$column['grupo']]);
                }
            } else {
                $ths1[] = $this->tag('th', $column['title'],$attributes)->toHtml();                
            }
        }
        $trs[] = $this->tag('tr', implode('', $ths1))->toHtml();
        if(isset($ths2)){
            $trs[] = $this->tag('tr', implode('', $ths2))->toHtml();        
        }
        return $this->tag('thead', implode('', $trs))->toHtml();
    }
    
    public function col($content = '', $md = 12, $sm = 12, $lg = 12,$xs = 12,$attributes = []){
        $this->addClassAttributes($attributes, "col-md-$md col-sm-$sm col-lg-$lg col-xs-$xs");
        return $this->tag('div',$content,$attributes);
    }
    
    public function alert($content, $type){
        $span = '<button type="button" class="close" data-dismiss="alert" aria-label="Fechar"><span aria-hidden="true">&times;</span></button>';
        return $this->tag('div',$span.$content,['class'=>'alert alert-'.$type.' alert-dismissible'])->toHtml();
    }
}
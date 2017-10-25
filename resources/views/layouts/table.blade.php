@php
    $table = Request::segment(3).'-'.Request::segment(5);
    $id = $table.'-'.rand(1,999);
@endphp
{{Html::tag('div','<div class="modal-dialog '.$modalSize.'" role="document"></div>',['class'=>'modal fade mymodal '.$main, 'id'=>'modal-fr-'.$table, 'tabindex'=>'-1','role'=>'dialog','data-keyboard'=>'false', 'data-backdrop'=>'static'])}}
{{Html::tag('div','',['id'=>'msg-global'])}}
<div class="row col-12">
    {{Form::tableFilter($filters,$table)}}
</div>
<br>
<div class="form-row" id="{{$id}}">
    {{Form::open(array('url'=>isset($urlAlt) ? $urlAlt : Request::url(),'class'=>'col-12 form-horizontal','id'=>'fr-registros-'.$table))}}
        @if(!$main)
            {{$inputId}}
        @endif
        <div class="btn-group-from">
        @if(isset($consulta))
            {{Form::buttonGroup([$consulta])}}
        @endif
        {{Form::buttonGroup([
            Form::button('Inserir',['color'=>'primary','icon'=>'fa fa-plus','data-toggle'=>'modal','data-target'=>'#modal-fr-'.$table,'data-form'=>'#fr-registros-'.$table,'data-action'=>'novo']),
            Form::button('Alterar',['color'=>'primary','icon'=>'fa fa-pencil','data-toggle'=>'modal','data-target'=>'#modal-fr-'.$table,'data-form'=>'#fr-registros-'.$table,'class'=>'btn-single','data-action'=>'alterar']),
            Form::button('Excluir',['color'=>'primary','icon'=>'fa fa-trash','data-form'=>'#fr-registros-'.$table,'class'=>'btn-excluir btn-multi']),
            Form::button('Visualizar',['color'=>'primary','icon'=>'fa fa-eye','data-toggle'=>'modal','data-target'=>'#modal-fr-'.$table,'data-form'=>'#fr-registros-'.$table,'class'=>'btn-single','data-action'=>'visualizar'])
        ])}}
        @if($btns)
            @foreach($btns as $btn)
                <div class='btn-group btn-group-sm'>
                    {{$btn}}
                </div>
            @endforeach
        @endif
        </div>
        <div class="form-group">
            <table id="{{$table}}" scrollY="{{$scrollY}}" class="table table-bordered table-hover table-sm" url="{{isset($urlAlt) ? $urlAlt : Request::url()}}/data"></table>
            <script type='text/javascript'>
                montaDataTable($('#{{$id}}').find('#{{$table}}'),$('#{{$id}}').find('#fr-registros-{{$table}}').serialize());
                atualizaBotoes($('#{{$id}}').find('#fr-registros-{{$table}}'));
            </script>
        </div>
    {{Form::close()}}
    <!--<div class="minmaxCon" style="margin-bottom: 50px;"></div>-->
</div>

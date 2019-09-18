<?php

function obtenerContactos(){
    include 'db.php';

    try{
        return $con->query("SELECT id,nombre,empresa,telefono FROM contactos
                            GROUP BY id");

    }catch(Exception $e){
        echo "Error!!" . $e->getMessage() . "<br>";
        return false;
    }
}

// Obtener un contacto
function obtenerContacto($id){
    include 'db.php';

    try{
        return $con->query("SELECT id,nombre,empresa,telefono FROM contactos
                            WHERE id = $id");

    }catch(Exception $e){
        echo "Error!!" . $e->getMessage() . "<br>";
        return false;
    }
}
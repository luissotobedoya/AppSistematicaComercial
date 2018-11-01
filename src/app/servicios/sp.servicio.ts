import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, ItemAddResult } from 'sp-pnp-js';
import { environment } from '../../environments/environment';

@Injectable()
export class SPServicio {
    constructor() {}

    private obtenerConfiguracion(){
        const configuracionSharepoint = pnp.sp.configure({
            headers:{
                "Accept":"application/json; odata=verbose"
            }
        },environment.urlWeb);
  
        return configuracionSharepoint;
    }

    private ObtenerConfiguracionConPost(){
        const configuracionSharepoint = pnp.sp.configure({
            headers:{
                "Accept":"application/json; odata=verbose",
                'Content-Type':'application/json;odata=verbose',
                'Authorization':'Bearer 0x0C043186F7C80477A9EA1F2B79057523D6AE8F1BAAE49641C91DB95272495EB22D8E43D055DAAFB58B89A77F33EFF069B073EB8727BA565EF4FBC586E25D2E92,13 Oct 2018 22:40:27 -0000'
            }
        },environment.urlWeb);
    
        return configuracionSharepoint;
      }

      ObtenerInformacionSitio(){
        let respuesta = from(this.obtenerConfiguracion().web.get());
        return respuesta;
    }

    ObtenerUsuarioActual(){
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerClasificaciones(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.maestroClasificacion).items.getAll());
        return respuesta;
    }


}
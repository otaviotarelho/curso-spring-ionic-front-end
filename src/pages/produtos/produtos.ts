import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

/**
 * Generated class for the ProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public produtoService: ProdutoService,
     public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get("categoria_id")).subscribe(
      response => {
        loader.dismiss();
        this.items = response['content'];
        this.getSmallImageIfExists();
      },
      error =>{ loader.dismiss(); }
    );
  }

  public getSmallImageIfExists(){
    for(var i = 0; i < this.items.length; i++){
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id).subscribe(
        response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error => {}
      );
    }
  }
  
  public showDetail(id: string){
    this.navCtrl.push("ProdutoDetailPage", {produto_id: id});
  }

  presentLoading() {
    let loader = this.loadingController.create({
      content: "Please wait..."
    });
    loader.present();
    return loader;
  }

}

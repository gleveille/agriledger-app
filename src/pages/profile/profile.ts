import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
  NavController, ActionSheetController, ModalController,
  LoadingController, App
} from "ionic-angular/index";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {TranslateServiceProvider} from "../../providers/translate-service";
import {UploadProvider} from "../../providers/upload";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";
import {AssetsService} from "../../providers/assets.service";
import {IndexProvider} from '../../providers/index/index';
import {AlertController} from 'ionic-angular';
import {UserDocumentDialogPage} from '../user-document-dialog/user-document-dialog';
import {CreateFarmPage} from "../create-farm/create-farm";
import {FarmInfoPage} from "../farm-info/farm-info";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  user = {
    profiles: {
      documents: [],
      address: {line1: '', line2: '', city: '', province: '', country: '', district: ''}
    }
  } as Iuser;
  tempUser = {
    profiles: {
      documents: [],
      address: {line1: '', line2: '', city: '', province: '', country: '', district: ''}
    }
  } as Iuser;

  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;
  farm:string = "accountDetails";
  disabledButton:boolean = true;

  allCountry:any = [''];
  allStates:any = [''];
  allCity:any = [''];
  allDistrict:any = [''];

  statesData:any;
  cityData:any;
  districtData:any;


  constructor(public navCtrl:NavController,
              private actionSheetCtrl:ActionSheetController,
              private modalController:ModalController,
              private loadingCtrl:LoadingController,
              private toastService:ToastProvider,
              private uploadService:UploadProvider,
              private userService:UserService,
              private translateService:TranslateServiceProvider,
              private assetsService:AssetsService,
              private indexProvider:IndexProvider,
              private alertCtrl:AlertController,
              private modalCtrl:ModalController,
              private app:App) {

    this.allCountry = ['China'];

    this.statesData = {

      China: ['Anhui', 'Fujian', 'Gansu', 'Guangdong',
        'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang',
        'Henan', 'Hubei', 'Hunan', 'Jiangsu', 'Jiangxi',
        'Jilin', 'Liaoning', 'Qinghai', 'Shaanxi',
        'Shandong', 'Shanxi', 'Sichuan', 'Yunnan', 'Zhejiang']
    }

    this.cityData = {

      'Anhui': ['Hefei', 'Huainan', 'Wuhu', 'Huaibei', 'Bengbu', 'Fuyang', 'Anhui→Suzhou', 'Lu an', 'Ma anshan', 'Anqing', 'Tongling'],
      'Fujian': ['Xiamen', 'Fuzhou', 'Jinjiang', 'Quanzhou', 'Putian', 'Nan an', 'Zhangzhou', 'Fuqing', 'Shishi', 'Hui an', 'Longyan'],
      'Gansu': ['Lanzhou', 'Tianshui', 'Baiyin', 'Wuwei', 'Jiuquan', 'Pingliang', 'Linxia', 'Zhangye', 'Jiayuguan	'],
      'Guangdong': ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Shantou', 'Zhongshan', 'Huizhou', 'Jiangmen', 'Zhuhai'],
      'Guizhou': ['Guiyang', '	Zunyi', 'Liupanshui', 'Bijie', 'Anshun', 'Xingyi', 'Kaili', 'Weining'],
      'Hainan': ['Haikou', 'Sanya', 'Danzhou', 'Wenchang', 'Wanning', 'Qionghai', 'Chengmai', 'Lingao', 'Dongfang'],
      'Hebei': ['Shijiazhuang', 'Tangshan', 'Baoding', 'Zhangjiakou', 'Qinhuangdao', 'Handan', 'Xingtai', 'Langfang'],
      'Heilongjiang': ['Harbin', 'Daqing', 'Qiqihar', 'Mudanjiang', 'Jixi', 'Yichun', 'Jiamusi', 'Hegang', 'Qitaihe'],
      'Henan': ['Zhengzhou', 'Luoyang', 'Xinxiang', 'Anyang', 'Nanyang', 'Kaifeng', 'Pingdingshan', 'Jiaozuo'],
      'Hubei': ['Wuhan', 'Xiangyang', 'Yichang', 'Jingzhou', 'Shiyan', 'Huangshi', 'Tianmen', 'Ezhou', 'Xiaogan', 'Xiantao'],
      'Hunan': ['	Changsha', 'Hengyang', 'Zhuzhou', 'Yueyang', 'Xiangtan', 'Changde', 'Yiyang', 'Liuyang', 'Chenzhou', 'Shaoyang', 'Yongzhou'],
      'Jiangsu': ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Xuzhou', 'Nantong', 'Yangzhou', 'Huai an', 'Yancheng', 'Kunshan', 'Jiangyin'],
      'Jiangxi': ['Nanchang', 'Ganzhou', 'Pingxiang', 'Jiujiang', 'Xinyu', 'Jiangxi→Fuzhou', 'Jiangxi→Yichun', 'Jingdezhen', 'Nanchang'],
      'Jilin': ['Changchun', 'Jilin', 'Siping', 'Yanji', 'Baishan', 'Tonghua', 'Songyuan', 'Liaoyuan', 'Baicheng', 'Gongzhuling'],
      'Liaoning': ['Shenyang', 'Dalian', 'Anshan', 'Fushun', 'Benxi', 'Jinzhou', 'Yingkou', 'Panjin', 'Dandong', 'Fuxin'],
      'Qinghai': ['Xining', 'Golmud', 'Datong', 'Minhe', 'Huangzhong', 'Ledu', 'Huzhu', 'Yushu', 'Delhi', 'Ping an'],
      'Shaanxi': ['Xi an', 'Baoji', 'Xianyang', 'Tongchuan', 'Yulin', 'Ankang', 'Hanzhong', 'Weinan', 'Yan an'],
      'Shandong': ['Qingdao', 'Jinan', 'Zibo', 'Yantai', 'Linyi', 'Weifang', 'Tai an', 'Zaozhuang', 'Jining', 'Rizhao'],
      'Shanxi': ['Taiyuan', 'Datong', 'Changzhi', 'Yangquan', 'Linfen', 'Jincheng', 'Jinzhong', 'Yuncheng', 'Shuozhou'],
      'Sichuan': ['Chengdu', 'Mianyang', 'Nanchong', 'Luzhou', 'Leshan', 'Zigong', 'Panzhihua'],
      'Yunnan': ['Kunming', 'Qujing', 'Xuanwei', 'Dali', 'Chuxiong', 'Yuxi', 'Baoshan', 'Zhaotong'],
      'Zhejiang': ['Hangzhou', 'Wenzhou', 'Ningbo', 'Shaoxing', 'Taizhou', 'Cixi', 'Rui an', 'Yiwu'],
      'Inner Mongolia': ['Hohhot', 'Baotou', 'Wuhai', 'Chifeng', 'Tongliao', 'Ordos', 'Hulunbuir', 'Bayannur', 'Ulanqab']
    }

    this.districtData = {
      'Hefei': ['Yaohai', 'Luyang', 'Shushan', 'Baohe'],
      'Wuhu': ['Jinghu', 'Yijiang', 'Jiujiang', 'Sanshan'],
      'Bengbu': ['Longzihu', 'Bengshan', 'Yuhui', 'Huaishang'],
      'Huainan': ['Datong', 'Tianjia an', 'Xiejiaji', 'Bagongshan', 'Panji'],
      'Ma anshan': ['Huashan', 'Yushan', 'Bowang'],
      'Huaibei': ['Duji', 'Xiangshan', 'Lieshan'],
      'Tongling': ['Tongguanshan', 'Shizishan', 'Jiaoqu(qu)'],
      'Anqing': ['Yingjiang', 'Daguan', 'Yixiu'],
      'Huangshan': ['Tunxi', 'Huangshan', 'Huizhou'],
      'Chuzhou': ['Langya', 'Nanqiao'],
      'Fuyang': ['Yingzhou', 'Yingdong', 'Yingquan'],
      'Anhui→Suzhou': ['Yongqiao'],
      'Lu an': ['Jin an', 'Yu an'],
      'Bozhou': ['Qiaocheng'],
      'Chizhou': ['Guichi'],
      'Xuancheng': ['Xuanzhou'],
      'Fuzhou': ['Gulou', 'Taijiang', 'Cangshan', 'Mawei', 'Jin an'],
      'Xiamen': ['Siming', 'Haicang', 'Huli', 'Jimei', 'Tong an', 'Xiang an'],
      'Putian': ['Chengxiang', 'Hanjiang', 'Licheng', 'Xiuyu'],
      'Sanming': ['Meilie', 'Sanyuan'],
      'Quanzhou': ['Licheng', 'Fengze', 'Luojiang', 'Quangang'],
      'Zhangzhou': ['Xiangcheng', 'Longwen'],
      'Nanping': ['Yanping', 'Yanping'],
      'Longyan': ['Xinluo'],
      'Ningde': ['Jiaocheng'],
      'Lanzhou': ['Chengguan', 'Qilihe', 'Xigu', 'Anning', 'Honggu'],
      'Jinchang': ['Jinchuan'],
      'Baiyin': ['Baiyin', 'Pingchuan'],
      'Tianshui': ['Qinzhou', 'Maiji'],
      'Wuwei': ['Liangzhou'],
      'Zhangye': ['Ganzhou'],
      'Pingliang': ['Kongtong'],
      'Jiuquan': ['Suzhou'],
      'Qingyang': ['Xifeng'],
      'Dingxi': ['Anding'],
      'Longnan': ['Wudu'],
      'Guangzhou': ['Liwan', 'Yuexiu', 'Haizhu', 'Tianhe', 'Baiyun', 'Huangpu', 'Panyu', 'Huadu', 'Nansha', 'Zengcheng', 'Conghua'],
      'Shenzhen': ['Luohu', 'Futian', 'Nanshan', 'Bao an', 'Guangming', 'Longhua', 'Longgang', 'Pingshan', 'Dapeng', 'Yantian'],
      'Zhuhai': ['Doumen', 'Jinwan', 'Xiangzhou'],
      'Shantou': ['Longhu', 'Jinping', 'Haojiang', 'Chaoyang', 'Chaonan', 'Chenghai'],
      'Foshan': ['Chancheng', 'Nanhai', 'Shunde', 'Gaoming', 'Sanshui'],
      'Jiangmen': ['Pengjiang', 'Jianghai', 'Xinhui'],
      'Shaoguan': ['Wujiang', 'Zhenjiang', 'Qujiang'],
      'Huizhou': ['Huicheng', 'Huiyang'],
      'Meizhou': ['Meijiang', 'Meixian'],
      'Maoming': ['Maonan', 'Dianbai'],
      'Zhaoqing': ['Duanzhou', 'Dinghu'],
      'Shanwei': ['Cheng(qu)'],
      'Heyuan': ['Yuancheng'],
      'Yangjiang': ['Jiangcheng', 'Yangdong'],
      'Qingyuan': ['Qingcheng', 'Qingxin'],
      'Chaozhou': ['Xiangqiao', 'Chao an'],
      'Jieyang': ['Rongcheng', 'Jiedong'],
      'Yunfu': ['Yuncheng', 'Yun an'],
      'Nanning': ['Xingning', 'Qingxiu', 'Jiangnan', 'Xixiangtang', 'Liangqing', 'Yongning'],
      'Liuzhou': ['Chengzhong', 'Yufeng', 'Liunan', 'Liubei'],
      'Guilin': ['Xiufeng', 'Diecai', 'Xiangshan', 'Qixing', 'Yanshan', 'Lingui'],
      'Wuzhou': ['Wanxiu', 'Changzhou', 'Longxu'],
      'Beihai': ['Haicheng', 'Yinhai', 'Tieshangang'],
      'Fangchenggang': ['Gangkou', 'Fangcheng'],
      'Qinzhou': ['Qinnan', 'Qinbei'],
      'Guigang': ['Gangbei', 'Guigang', 'Qintang'],
      'Baise': ['Youjiang'],
      'Hezhou': ['Babu'],
      'Hechi': ['Jinchengjiang'],
      'Laibin': ['Xingbin'],
      'Chongzuo': ['Jiangzhou'],
      'Guiyang': ['Nanming', 'Yunyan', 'Huaxi', 'Wudang', 'Baiyun', 'Jinyang → Guanshanhu'],
      'Liupanshui': ['Zhongshan', 'Liuzhi'],
      'Zunyi': ['Honghuagang', 'Huichuan'],
      'Anshun': ['Xixiu'],
      'Tongren': ['Tongren → Bijiang', 'Wanshan'],
      'Bijie': ['Bijie → Qixingguan'],
      'Haikou': ['Xiuying', 'Longhua', 'Qiongshan', 'Meilan'],
      'Sanya': ['Jiyang', 'Fenghuang', 'Haitang', 'Yazhou'],
      'Shijiazhuang': ['Chang an', 'Qiaoxi', 'Xinhua', 'Yuhua', 'Jingxing(qu)'],
      'Tangshan': ['Lunan', 'Lubei', 'Guye', 'Kaiping', 'Fengnan', 'Fengrun', 'Tanghai → Caofeidian'],
      'Qinhuangdao': ['Haigang', 'Shanhaiguan', 'Beidaihe'],
      'Handan': ['Hanshan', 'Congtai', 'Fuxing', 'Fengfeng'],
      'Xingtai': ['Qiaodong', 'Qiaoxi'],
      'Baoding': ['Xinshi', 'Beishi', 'Nanshi'],
      'Zhangjiakou': ['Qiaodong', 'Qiaoxi', 'Xuanhua(qu)', 'Xiahuayuan'],
      'Chengde': ['Shuangqiao', 'Shuangluan', 'Yingshouyingzi', 'Xinhua', 'Yunhe'],
      'Langfang': ['Anci', 'Guangyang'],
      'Hengshui': ['Taocheng'],
      'Harbin': ['Daoli', 'Nangang', 'Daowai', 'Xiangfang', 'Pingfang', 'Songbei', 'Hulan', 'Acheng', 'Shuangcheng'],
      'Qiqihar': ['Longsha', 'Jianhua', 'Tiefeng', 'Ang angxi', 'Fularji', 'Nianzishan', 'Meilisi'],
      'Jixi': ['Jiguan', 'Hengshan', 'Didao', 'Lishu', 'Chengzihe', 'Mashan'],
      'Hegang': ['Xiangyang', 'Gongnong', 'Nanshan', 'Xing an', 'Dongshan', 'Xingshan'],
      'Shuangyashan': ['Jianshan', 'Lingdong', 'Sifangtai', 'Baoshan'],
      'Daqing': ['Sartu', 'Longfeng', 'Ranghulu', 'Honggang', 'Datong'],
      'Yichun': ['Yichun', 'Nancha', 'Youhao', 'Xilin', 'Cuiluan', 'Xinqing', 'Meixi', 'Jinshantun', 'Wuying', 'Wumahe', 'Tangwanghe', 'Dailing', 'Wuyiling', 'Hongxing', 'Shangganling'],
      'Jiamusi': ['Xiangyang', 'Qianjin', 'Dongfeng', 'Jiao(qu)'],
      'Qitaihe': ['Xinxing', 'Taoshan', 'Qiezihe'],
      'Mudanjiang': ['Dong an', 'Yangming', 'Aimin', 'Xi an'],
      'Heihe': ['Aihui'],
      'Suihua': ['Beilin'],
      'Da Hinggan Ling': ['Jiagedaqi', 'Songling', 'Xinlin', 'Huzhong'],
      'Zhengzhou': ['Zhongyuan', 'Erqi', 'Guancheng', 'Jinshui', 'Shangjie', 'Huiji'],
      'Kaifeng': ['Longting', 'Shunhe', 'Gulou', 'Yuwangtai'],
      'Luoyang': ['Laocheng', 'Xigong', 'Chanhe', 'Jianxi', 'Jili', 'Luolong'],
      'Pingdingshan': ['Xinhua', 'Weidong', 'Shilong', 'Zhanhe'],
      'Anyang': ['Wenfeng', 'Beiguan', 'Yindu', 'Long an'],
      'Hebi': ['Heshan', 'Shancheng', 'Qibin'],
      'Xinxiang': ['Hongqi', 'Weibin', 'Fengquan', 'Muye'],
      'Jiaozuo': ['Jiefang', 'Zhongzhan', 'Macun', 'Shanyang'],
      'Puyang': ['Hualong'],
      'Xuchang': ['Weidu'],
      'Luohe': ['Yuanhui', 'Yancheng', 'Shaoling'],
      'Sanmenxia': ['Hubin'],
      'Nanyang': ['Wancheng', 'Wolong'],
      'Shangqiu': ['Liangyuan', 'Suiyang'],
      'Xinyang': ['Shihe', 'Pingqiao'],
      'Zhoukou': ['Chuanhui'],
      'Zhumadian': ['Yicheng'],
      'Wuhan': ['Jiang an', 'Jianghan', 'Qiaokou', 'Hanyang', 'Wuchang', 'Qingshan', 'Hongshan', 'Dongxihu', 'Hannan', 'Caidian', 'Jiangxia', 'Huangpi', 'Xinzhou'],
      'Huangshi': ['Huangshigang', 'Xisaishan', 'Xialu', 'Tieshan'],
      'Shiyan': ['Maojian', 'Yunyang', 'Zhangwan'],
      'Yichang': ['Xiling', 'Wujiagang', 'Dianjun', 'Xiaoting', 'Yiling'],
      'Xiangyang': ['Xiangcheng', 'Fancheng', 'Xiangyang → Xiangzhou'],
      'Ezhou': ['Liangzihu', 'Huarong', 'Echeng'],
      'Jingmen': ['Dongbao', 'Duodao'],
      'Xiaogan': ['Xiaonan'],
      'Jingzhou': ['Shashi', 'Jingzhou'],
      'Huanggang': ['Huangzhou'],
      'Xianning': ['Xian an'],
      'Suizhou': ['Zengdu'],
      'Changsha': ['Furong', 'Tianxin', 'Yuelu', 'Kaifu', 'Yuhua', 'Wangcheng'],
      'Zhuzhou': ['Hetang', 'Lusong', 'Shifeng', 'Tianyuan'],
      'Xiangtan': ['Yuetang', 'Yuhu'],
      'Hengyang': ['Zhuhui', 'Yanfeng', 'Shigu', 'Zhengxiang', 'Nanyue'],
      'Shaoyang': ['Shuangqing', 'Daxiang', 'Beita'],
      'Yueyang': ['Yueyanglou', 'Yunxi', 'Junshan'],
      'Changde': ['Wuling', 'Dingcheng'],
      'Zhangjiajie': ['Yongding', 'Wulingyuan'],
      'Yiyang': ['Ziyang', 'Heshan'],
      'Chenzhou': ['Beihu', 'Suxian'],
      'Yongzhou': ['Lingling', 'Lengshuitan'],
      'Huaihua': ['Hecheng', 'Hongjiang(qu)'],
      'Loudi': ['Louxing'],
      'Lishui': ['Liandu'],
      'Taizhou': ['Luqiao', 'Huangyan', 'Jiaojiang'],
      'Zhoushan': ['Putuo', 'Dinghai'],
      'Quzhou': ['Qujiang', 'Kecheng'],
      'Jinhua': ['Jindong', 'Wucheng'],
      'Shaoxing': ['Shangyu', 'Keqiao', 'Yuecheng'],
      'Huzhou': ['Nanxun', 'Wuxing'],
      'Jiaxing': ['Xiuzhou', 'Nanhu'],
      'Wenzhou': ['Ouhai', 'Longwan', 'Lucheng'],
      'Ningbo': ['Yinzhou', 'Zhenhai', 'Beilun', 'Jiangbei', 'Jiangdong', 'Haishu'],
      'Hangzhou': ['Yuhang', 'Xiaoshan', 'Binjiang', 'Xihu', 'Gongshu', 'Jianggan', 'Xiacheng', 'Shangcheng'],
      'Lincang': ['Linxiang'],
      'Pu er': ['Simao'],
      'Lijiang': ['Gucheng'],
      'Zhaotong': ['Zhaoyang'],
      'Baoshan': ['Longyang'],
      'Yuxi': ['Hongta'],
      'Qujing': ['Qilin'],
      'Kunming': ['Chenggong', 'Dongchuan', 'Xishan', 'Guandu', 'Panlong', 'Wuhua'],
      'Karamay': ['Urho', 'Baijiantan', 'Dushanzi', 'Karamay'],
      'Ürümqi': ['Midong', 'Dabancheng', 'Toutunhe', 'Shuimogou', 'Xinshi', 'Saybagh', 'Tianshan'],
      'Qamdo': ['Karub'],
      'Xigazê': ['Samzhubzê'],
      'Lhasa': ['Chengguan'],
      'Ziyang': ['Yanjiang'],
      'Bazhong': ['Enyang', 'Bazhou'],
      'Ya an': ['Mingshan', 'Yucheng'],
      'Dazhou': ['Dachuan', 'Tongchuan'],
      'Guang an': ['Qianfeng', 'Guang an'],
      'Yibin': ['Nanxi', 'Cuiping'],
      'Meishan': ['Pengshan', 'Dongpo'],
      'Nanchong': ['Jialing', 'Gaoping', 'Shunqing'],
      'Leshan': ['Jinkouhe', 'Wutongqiao', 'Shawan', 'Shizhong'],
      'Neijiang': ['Dongxing', 'Shizhong'],
      'Suining': ['Anju', 'Chuanshan'],
      'Guangyuan': ['Chaotian', 'Yuanba → Zhaohua', 'Lizhou'],
      'Mianyang': ['Youxian', 'Fucheng'],
      'Deyang': ['Jingyang'],
      'Luzhou': ['Longmatan', 'Naxi', 'Jiangyang'],
      'Panzhihua': ['Renhe', 'Xi(qu)', 'Dong(qu)'],
      'Zigong': ['Yantan', 'Da an', 'Gongjing', 'Ziliujing'],
      'Chengdu': ['Wenjiang', 'Xindu', 'Qingbaijiang', 'Longquanyi', 'Chenghua', 'Wuhou', 'Jinniu', 'Qingyang', 'Jinjiang'],
      'Lüliang': ['Lishi'],
      'Linfen': ['Yaodu'],
      'Xinzhou': ['Xinfu'],
      'Yuncheng': ['Yanhu'],
      'Jinzhong': ['Yuci'],
      'Shuozhou': ['Pinglu', 'Shuocheng'],
      'Jincheng': ['Cheng(qu)'],
      'Changzhi': ['Jiao(qu)', 'Cheng(qu)'],
      'Yangquan': ['Jiao(qu)', 'Kuang(qu)', 'Cheng(qu)'],
      'Datong': ['Xinrong', 'Nanjiao', 'Kuang(qu)', 'Cheng(qu)'],
      'Taiyuan': ['Jinyuan', 'Wanbailin', 'Jiancaoping', 'Xinghualing', 'Yingze', 'Xiaodian'],
      'Heze': ['Mudan'],
      'Binzhou': ['Zhanhua', 'Bincheng'],
      'Liaocheng': ['Dongchangfu'],
      'Dezhou': ['Lingcheng', 'Decheng'],
      'Linyi': ['Hedong', 'Luozhuang', 'Lanshan'],
      'Laiwu': ['Gangcheng', 'Laicheng'],
      'Rizhao': ['Lanshan', 'Donggang'],
      'Weihai': ['Huancui', 'Wendeng'],
      'Tai an': ['Taishan', 'Daiyue'],
      'Jining': ['Rencheng', 'Yanzhou'],
      'Weifang': ['Weicheng', 'Hanting', 'Fangzi', 'Kuiwen'],
      'Yantai': ['Zhifu', 'Fushan', 'Muping', 'Laishan'],
      'Dongying': ['Dongying', 'Hekou'],
      'Zaozhuang': ['Shizhong', 'Xuecheng', 'Yicheng', 'Tai erzhuang', 'Shanting'],
      'Zibo': ['Zichuan', 'Zhangdian', 'Boshan', 'Linzi', 'Zhoucun'],
      'Qingdao': ['Shinan', 'Shibei', 'Licang', 'Huangdao', 'Laoshan', 'Chengyang'],
      'Jinan': ['Lixia', 'Shizhong', 'Huaiyin', 'Tianqiao', 'Licheng', 'Changqing'],
      'Shangluo': ['Shangzhou'],
      'Ankang': ['Hanbin'],
      'Yulin': ['Yuyang'],
      'Hanzhong': ['Hantai'],
      'Yan an': ['Baota'],
      'Weinan': ['Linwei'],
      'Xianyang': ['Weicheng', 'Yangling', 'Qindu'],
      'Baoji': ['Chencang', 'Jintai', 'Weibin'],
      'Tongchuan': ['Yaozhou', 'Yintai', 'Wangyi'],
      'Xi an	Shaanxi': ['Xincheng', 'Beilin', 'Lianhu', 'Baqiao', 'Weiyang', 'Yanta', 'Yanliang', 'Yanliang', 'Chang an'],
      'Haidong': ['Ledu'],
      'Xining': ['Chengdong', 'Chengzhong', 'Chengxi', 'Chengbei'],
      'Zhongwei': ['Shapotou'],
      'Guyuan': ['Yuanzhou'],
      'Wuzhong': ['Litong', 'Hongsibu'],
      'Shizuishan': ['Dawukou', 'Huinong'],
      'Yinchuan': ['Xingqing', 'Xixia', 'Jinfeng'],
      'Huludao': ['Lianshan', 'Longgang', 'Nanpiao'],
      'Jinzhou': ['Guta', 'Taihe', 'Linghe'],
      'Yingkou': ['Zhanqian', 'Xishi', 'Bayuquan', 'Laobian'],
      'Anshan': ['Tiedong', 'Tiexi', 'Lishan', 'Qianshan'],
      'Fushun': ['Xinfu', 'Dongzhou', 'Wanghua', 'Shuncheng'],
      'Chaoyang': ['Shuangta', 'Longcheng'],
      'Tieling': ['Yinzhou', 'Qinghe'],
      'Panjin': ['Shuangtaizi', 'Xinglongtai'],
      'Liaoyang': ['Baita', 'Wensheng', 'Hongwei', 'Gongchangling', 'Taizihe'],
      'Dandong': ['Yuanbao', 'Zhenxing', 'Zhen an'],
      'Benxi': ['Pingshan', 'Xihu', 'Mingshan', 'Nanfen'],
      'Fuxin': ['Haizhou', 'Xinqiu', 'Taiping', 'Qinghemen', 'Xihe'],
      'Dalian': ['Zhongshan', 'Xigang', 'Shahekou', 'Ganjingzi', 'Lüshunkou', 'Jinzhou'],
      'Shenyang': ['Heping', 'Shenhe', 'Dadong', 'Huanggu', 'Tiexi', 'Sujiatun', 'Dongling → Hunnan', 'Shenbei', 'Yuhong'],
      'Baicheng': ['Taobei'],
      'Songyuan': ['Ningjiang'],
      'Baishan': ['Badaojiang → Hunjiang', 'Jiangyuan'],
      'Tonghua': ['Dongchang', 'Erdaojiang'],
      'Liaoyuan': ['Longshan', 'Xi an	Liaoyuan'],
      'Siping': ['Tiexi', 'Tiedong'],
      'Jilin': ['Changyi', 'Longtan', 'Chuanying', 'Fengman'],
      'Changchun': ['Nanguan', 'Kuancheng', 'Chaoyang', 'Erdao', 'Luyuan', 'Shuangyang', 'Jiutai'],
      'Shangrao': ['Xinzhou'],
      'Jiangxi→Fuzhou': ['Linchuan'],
      'Jiangxi→Yichun': ['Yuanzhou'],
      'Ji an	Jiangxi': ['Jizhou', 'Qingyuan'],
      'Ganzhou': ['Zhanggong', 'Nankang'],
      'Yingtan': ['Yuehu'],
      'Xinyu': ['Yushui'],
      'Jiujiang': ['Lushan', 'Xunyang'],
      'Pingxiang': ['Anyuan', 'Xiangdong'],
      'Jingdezhen': ['Zhushan', 'Changjiang'],
      'Nanchang': ['Donghu', 'Xihu', 'Qingyunpu', 'Wanli', 'Wanli'],
      'Suqian': ['Sucheng', 'Suyu'],
      'Zhenjiang': ['Jingkou', 'Runzhou', 'Dantu'],
      'Yangzhou': ['Guangling', 'Hanjiang', 'Jiangdu'],
      'Yancheng': ['Tinghu', 'Yandu'],
      'Huai an': ['Qinghe', 'Chuzhou → Huai an', 'Huaiyin', 'Qingpu'],
      'Lianyungang': ['Haizhou', 'Lianyun', 'Ganyu'],
      'Nantong': ['Chongchuan', 'Gangzha', 'Tongzhou'],
      'Suzhou': ['Gusu', 'Huqiu', 'Wuzhong', 'Xiangcheng', 'Wujiang'],
      'Changzhou': ['Tianning', 'Zhonglou', 'Qishuyan', 'Xinbei', 'Wujin'],
      'Xuzhou': ['Gulou', 'Yunlong', 'Jiawang', 'Quanshan', 'Tongshan'],
      'Wuxi': ['Chong an', 'Nanchang', 'Beitang', 'Binhu', 'Huishan', 'Xishan'],
      'Nanjing': ['Xuanwu', 'Qinhuai', 'Jianye', 'Gulou', 'Pukou', 'Qixia', 'Yuhuatai',
        'Jiangning', 'Luhe', 'Lishui', 'Gaochun'],
      'Ulanqab': ['Jining'],
      'Bayannur': ['Linhe'],
      'Hulunbuir': ['Hailar', 'Jalainur'],
      'Ordos': ['Dongsheng'],
      'Tongliao': ['Horqin'],
      'Chifeng': ['Hongshan', 'Yuanbaoshan', 'Songshan'],
      'Wuhai': ['Haibowan', 'Hainan', 'Wuda'],
      'Baotou': ['Donghe', 'Hondlon', 'Qingshan', 'Shiguai', 'Bayan Obo', 'Jiuyuan', 'Binhe'],
      'Hohhot': ['Xincheng', 'Huimin', 'Yuquan', 'Saihan']
    }

  }

  checkStatus() {
    if (JSON.stringify(this.user.profiles) === JSON.stringify(this.tempUser.profiles)) {
      this.disabledButton = true;
      console.log(true);
    } else {
      this.disabledButton = false;
      console.log(false);
    }
  }

  onImageClick(i:number, type:string) {
    let modal = this.modalCtrl.create(UserDocumentDialogPage, {user: this.user, index: i, type}, {
      showBackdrop: true,
      enableBackdropDismiss: true
    });
    modal.present();
  }

  onCountryChange(event) {
    console.log('onCountryChange ' + event)
    this.allStates = this.statesData[event];
    // if(!this.allStates.length){
    //   this.allStates.push('N/A');
    // }
    //this.allStates.unshift('N/A');
    this.allDistrict = [];
    this.allCity = [];
    this.checkStatus();

  }

  onStateChange(event) {
    console.log('onStateChange ' + event)
    this.allCity = this.cityData[event];

    this.allDistrict = [];

    this.checkStatus();
  }

  onCityChange(event) {
    console.log('onCityChange ' + event)
    this.allDistrict = this.districtData[event];

    this.checkStatus();
  }

  onDistrictChange(event) {
    console.log('onDistrictChange ' + event)
    this.checkStatus();
  }

  onChange(keyCode) {

    //console.log(keyCode)
    console.log(this.user.profiles);
    console.log(this.tempUser.profiles);

    this.checkStatus();

  }

  showWelcomeMessage() {
    let alert = this.alertCtrl.create({
      title: 'Welcome to Agriledger',
      subTitle: 'Please verify your details and edit if any corrections are required',
      buttons: ['OK']
    });
    alert.present();

  }

  ionViewDidLoad() {
    if (this.indexProvider.selectedIndex === 4) {
      this.showWelcomeMessage();
      this.indexProvider.selectedIndex = 0;
    }

    this.subscribeUser();
    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';

    console.log('Profile details');
    console.log(this.user);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.userService.loadUser().subscribe(()=>{
      refresher.complete();

    },(err)=>{
      refresher.complete();

    });

  }

  updateProfile() {
    let loader = this.loadingCtrl.create({
      content: 'Upading profile...'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data) => {
      loader.dismiss();

      this.toastService.presentToast('Profile Updated...');
      //Adding code here. Start....
      this.disabledButton = true;
      this.tempUser = JSON.parse(JSON.stringify(this.user));
      //End..
    }, (err) => {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Profile could not be Updated...')

    })
  }



  subscribeUser() {
    console.log('inside ')
    this.userService.user.subscribe((user:Iuser) => {
      this.user = user;
      console.log(this.user)
      this.tempUser = JSON.parse(JSON.stringify(this.user));//changing code here...
    });
  }

  verify(source:string, uploadType:string) {
    let passcodeModal = this.modalController.create(PasscodeLockPage, {passcode: this.user.profiles.passcode});
    passcodeModal.present();
    passcodeModal.onDidDismiss(data => {
      console.log(data);
      if (data && data.success === true) {
        this.upload(source, uploadType);
      }
      else {
      }
    });
  }

  async upload(source:string, uploadType:string) {
    const config:IUploadPageConfig = {
      uploadType: uploadType, //profile,field
      id: this.user.profiles.id
    };
    let isUploaded;
    if (source === 'camera') {
      isUploaded = await this.uploadService.takePhotoFromCamera(config);
    }
    else if (source === 'album') {
      isUploaded = await this.uploadService.takePhotoFromAlbum(config);
    }
    if (isUploaded) {
      return true;
    }
    else {
      return false;
    }
  }

  presentActionSheetDocs() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add Documents/Images',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.verify('album', 'profile_documents')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera', 'profile_documents')
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change Profile',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.verify('album', 'profile')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.verify('camera', 'profile')

          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  changeLang() {
    this.defaultLangauge = this.defaultLangauge === 'ch' ? 'en' : 'ch';
    this.translateService.changeLang(this.defaultLangauge);
    this.showdropdown = false
    console.log(this.defaultLangauge)
  }

  updateFarm() {
    let loader = this.loadingCtrl.create({
      content: 'Upading Farm details..'
    });
    loader.present();

    this.userService.updateProfile(this.user).subscribe((data) => {
      loader.dismiss();

      this.toastService.presentToast('Farm details Updated...')
      this.navCtrl.pop();
    }, (err) => {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Farm details could not be Updated...')

    })
  }

  createFarm() {
    this.navCtrl.push(CreateFarmPage);
    //this.app.getRootNav().push(CreateFarmPage);
  }

  farmInfo(index:number) {
    this.navCtrl.push(FarmInfoPage, {user: this.user, index: index});
  }


}

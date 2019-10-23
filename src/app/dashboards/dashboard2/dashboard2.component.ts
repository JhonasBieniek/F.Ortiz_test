import { Component, AfterViewInit, ViewChild } from '@angular/core';

import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";
declare var require: any;

const data: any = require('./data.json');

export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
      
})
export class Dashboard2Component implements AfterViewInit{
    
    
    // Barchart
    barChart1: Chart = {
        type: 'Bar',
        data: data['Bar'],
        options: {
            seriesBarDistance: 15,
            high: 12,
            axisX: {
                showGrid: false, offset: 20
            },
            axisY: {
                showGrid: true, offset: 40
            }
        },
        responsiveOptions: [
            [
                'screen and (min-width: 640px)',
                {
                    axisX: {
                        labelInterpolationFnc: function (value: number, index: number): string {
                            return index % 1 === 0 ? `${value}` : null;
                        }
                    }
                }
            ]
        ]
    }; 
    
    
    // Doughnut
    public doughnutChartLabels: string[] = [
        'Desktop',
        'Mobile',
        'Tablet'
    ];
    public doughnutChartOptions: any = {
        responsive: false
    };
     
    public doughnutChartData: number[] = [350, 450, 100];
    public doughnutChartType: string = 'doughnut';
    public doughnutChartLegend: boolean = false;
    
     ngAfterViewInit(){
        //Sparkline chart
        var sparklineLogin = function () {
            // spark count
            (<any>$('.spark-count')).sparkline([4, 5, 0, 10, 9, 12, 4, 9, 4, 5, 3, 10, 9, 12, 10, 9, 12, 4, 9], {
                type: 'bar'
                , width: '100%'
                , height: '70'
                , barWidth: '2'
                , resize: true
                , barSpacing: '6'
                , barColor: 'rgba(255, 255, 255, 0.3)'
            });

        }
        var sparkResize;
        (<any>$(window)).resize(function(e) {
                clearTimeout(sparkResize);
                sparkResize = setTimeout(sparklineLogin, 500);
            });
        sparklineLogin();
         /**
       * Set the paginator after the view init since this component will
       * be able to query its view for the initialized paginator.
       */
         this.dataSource.paginator = this.paginator;
     }
    
    // This is for the table
    displayedColumns = ['position', 'name', 'weight', 'designation'];
    dataSource = new MatTableDataSource<Element>(ELEMENT_DATA); 
    @ViewChild ( MatPaginator ) paginator: MatPaginator;
    // This is for the comments
    mycomments: Object[] = [{
      name: 'James Anderson',
      content: 'Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has beenorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/1.jpg',    
      status: 'Pending',
      class: 'info',    
      date: 'April 14, 2016'  
    },{
      name: 'Michael Jorden',
      content: 'Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has beenorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/2.jpg',    
      status: 'Approved',
      class: 'light-success',     
      date: 'April 14, 2016'  
    },{
      name: 'James Anderson',
      content: 'Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has beenorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/3.jpg',    
      status: 'Pending',
      class: 'danger',        
      date: 'April 14, 2016'  
    },{
      name: 'Johnathan Doeting',
      content: 'Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has beenorem Ipsum is simply dummy text of the printing and type setting industry.',
      profile: 'assets/images/users/1.jpg',    
      status: 'Pending',
      class: 'info',     
      date: 'April 14, 2016'  
    }];

    // This is for Mymessages
    mymessages: Object[] = [{
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',    
      subject: 'Just see the my admin!',
      time: '9:30 AM'  
    }, {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',    
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    }, {
      useravatar: 'assets/images/users/3.jpg',
      status: 'away',
      from: 'Arijit Sinh',    
      subject: 'I am a singer!',
      time: '9:08 AM'
    },{
      useravatar: 'assets/images/users/4.jpg',
      status: 'busy',
      from: 'Sonu Nigam',    
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    }, {
      useravatar: 'assets/images/users/6.jpg',
      status: 'away',
      from: 'Arijit Sinh',    
      subject: 'I am a singer!',
      time: '9:08 AM'
    },{
      useravatar: 'assets/images/users/7.jpg',
      status: 'busy',
      from: 'Sonu Nigam',    
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    }, {
      useravatar: 'assets/images/users/8.jpg',
      status: 'away',
      from: 'Arijit Sinh',    
      subject: 'I am a singer!',
      time: '9:08 AM'
    }, {
      useravatar: 'assets/images/users/6.jpg',
      status: 'offline',
      from: 'Pavan kumar',    
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }];
     
}
export interface Element {
  name: string;
  position: string;
  weight: number;
  designation: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 'assets/images/users/1.jpg', name: 'Nirav joshi', weight: 1.0079, designation: 'H'},
  {position: 'assets/images/users/2.jpg', name: 'Sunil joshi', weight: 4.0026, designation: 'He'},
  {position: 'assets/images/users/3.jpg', name: 'Vishal Bhatt', weight: 6.941, designation: 'Li'},
  {position: 'assets/images/users/4.jpg', name: 'Beryllium Lon', weight: 9.0122, designation: 'Be'},
  {position: 'assets/images/users/5.jpg', name: 'Boron son', weight: 10.811, designation: 'B'},
  {position: 'assets/images/users/6.jpg', name: 'Carbon hryt', weight: 12.0107, designation: 'C'},
  {position: 'assets/images/users/7.jpg', name: 'Nitro oxur', weight: 14.0067, designation: 'N'},
  {position: 'assets/images/users/8.jpg', name: 'Oxyg rigch', weight: 15.9994, designation: 'O'},
]; 

##### IMPORTING ALL REQUIRED MODULES TO CREATE AND FORMAT EXCEL FILE#####

import json,csv,os,time
from datetime import datetime
import pytz,string
import pandas as pd
import openpyxl
import boto3
import io
from io import BytesIO

import xlsxwriter
from datetime import datetime
import logging
import getpass

 
from openpyxl import load_workbook
from openpyxl.styles import PatternFill,Border,Side
import warnings
warnings.filterwarnings("ignore")


class Mytestfunction():
    result = dict()

    def run(self,QueryResult,FolderPath,FolderName):
        try:
            ### Checking if Directory Already Exists with use case Name if not then create it
            
            now = datetime.now()
           
            logger=logging.getLogger() 

            #Now we are going to Set the threshold of logger to DEBUG 
            logger.setLevel(logging.DEBUG) 



            quarter=""
            if (currentMonth>0 and currentMonth<4):
                quarter="Q1"
                quarter_number=1
                first_month_in_quarter=1
                self.Write_Log('info',quarter)
            if (currentMonth>3 and currentMonth<7):
                quarter="Q2"
                quarter_number=2
                first_month_in_quarter=4
                self.Write_Log('info',quarter)
            if (currentMonth>6 and currentMonth<10):
                quarter="Q3"
                quarter_number=3
                first_month_in_quarter=7
                #self.Write_Log('info',quarter)
            if (currentMonth>9 and currentMonth<13):
                quarter="Q4"
                quarter_number=4
                first_month_in_quarter=10
                self.Write_Log('info',quarter)
            
            FilePath = FolderPath +"QUARTERLY/"+"GRC_Autotrack_Report_Q"+str(quarter_number) +"_"+ str(currentYear) + ".xlsx"
            FileName = "GRC_Autotrack_Report_"+ quarter +"_"+ str(currentYear)+".xlsx"
            self.Write_Log('info',FilePath)
            previousquarter_value = quarter_number - 1
            FilePathPrevious = FolderPath +"QUARTERLY/"+"GRC_Autotrack_Report_Q"+str(previousquarter_value) +"_"+ str(currentYear) + ".xlsx"
            self.Write_Log('info',FilePathPrevious)
            daily_key = FolderPath+FolderName+"GRC_Autotrack_Daily_"+str(date_time)+".xlsx"
            logs_key = FolderPath+"Logs/"+"logs_auto.txt"
            #daily_key = 'GRC_Reporting/AUTOTRACK_REPORT/GRC_Autotrack_Daily_2023-07-28.xlsx'
            self.Write_Log('info',daily_key)


            count = len(QueryResult)+1
            #self.Write_Log('info', 'count')
            #self.Write_Log('info', count)

            s3_client = boto3.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            )
            quarterly_current_key = FilePath
            quarterly_previous_key = FilePathPrevious


            obj = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=daily_key)


            result = s3_client.list_objects_v2(Bucket=AWS_S3_BUCKET, Prefix=quarterly_current_key)
            result_previous = s3_client.list_objects_v2(Bucket=AWS_S3_BUCKET, Prefix=quarterly_previous_key)
            
            s3_client.put_object(Body=, Bucket=AWS_S3_BUCKET, Key=logs_key)
            
            if 'Contents' in result:
                self.Write_Log('info','Autotrack Quartertly File exists in the bucket. Now Append the Data from Daily Report')
                obj_q = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=quarterly_current_key)

                daily = pd.read_excel(obj['Body'].read())
               
                #quarterly = pd.read_excel(quarterly_key)
                quarterly = pd.read_excel(obj_q['Body'].read())

                #self.Write_Log('info',i)
                all_df_list = [daily, quarterly]

                # Pandas will automatically append based on similar column names
                df = pd.concat(all_df_list)
                


                self.Write_Log('info',"df before")
                self.Write_Log('info',df)
                logging.basicConfig(filename="std1.log", 
                                    format='%(asctime)s %(message)s', 
                                    filemode='w') 
                    
                logger.info(getpass.getuser()) 
                logger.info("This is just an information for you")                                 
                if (quarter_number == 1 and first_month_in_quarter == 1): 
                    startdate = str(currentYear)+"-01-01T00:00:00"
                    enddate = str(currentYear)+"-03-31T23:59:59"
                    startdate_prev = str(currentYear-1)+"-10-0 1T00:00:00"
                    enddate_prev = str(currentYear-1)+"-01-01T00:00:00"                    

                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df)                     
                if (quarter_number == 2 and first_month_in_quarter == 4): 
                    startdate = str(currentYear)+"-04-01T00:00:00"
                    enddate = str(currentYear)+"-06-30T23:59:59"
                    startdate_prev = str(currentYear)+"-01-01T00:00:00"
                    enddate_prev = str(currentYear)+"-04-01T00:00:00" 
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df)  

                if (quarter_number == 3 and first_month_in_quarter == 7):   
                    startdate = str(currentYear)+"-07-01T00:00:00"
                    enddate = str(currentYear)+"-09-30T23:59:59"
                    startdate_prev = str(currentYear)+"-04-01T00:00:00"
                    enddate_prev = str(currentYear)+"-07-01T00:00:00"  
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df)                                              

                if (quarter_number == 4 and first_month_in_quarter == 10):
                    startdate = str(currentYear)+"-10-01T00:00:00"
                    enddate = str(currentYear)+"-12-31T23:59:59"
                    startdate_prev = str(currentYear)+"-07-01T00:00:00"                    
                    enddate_prev = str(currentYear)+"-10-01T00:00:00"   
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    print(new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    print(current_df) 

                with io.BytesIO() as output:
                    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                        current_df.to_excel(writer, sheet_name='Sheet1', startrow=1, header=False, index=False)
                        # Get the xlsxwriter workbook and worksheet objects.
                        workbook  = writer.book
                        worksheet = writer.sheets['Sheet1']

                        # Add a header format.
                        header_format = workbook.add_format({
                            'bold': True,
                            'text_wrap': True,
                            'valign': 'top',
                            'fg_color': '#75ffbf',
                            'border': 1})

                        # Write the column headers with the defined format.
                        for col_num, value in enumerate(current_df.columns.values):
                            current_df.columns.str.upper()
                            worksheet.write(0, col_num , value, header_format)
                            
                        column_settings = [{'header': column} for column in current_df.columns]
                        (max_row, max_col) = current_df.shape

                        worksheet.add_table(0, 0, max_row, max_col - 1, {'columns': column_settings})
                        border_fmt = workbook.add_format({'bottom':1, 'top':1, 'left':1, 'right':1})
                        worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(current_df), len(current_df.columns)), {'type': 'no_errors', 'format': border_fmt})
                        worksheet.autofit()

                    data = output.getvalue()

                    response = s3_client.put_object(
                        Bucket=AWS_S3_BUCKET, Key=quarterly_current_key, Body=data
                    )

                    status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

                    if status == 200:
                        self.Write_Log('info',"Successful file put_object response for CURRENT QUARTERLY REPORT ")
                        self.Write_Log('info',FilePath)
                    else:
                        self.Write_Log('info',"Unsuccessful file put_object response for CURRENT QUARTERLY REPORT ")
                        self.Write_Log('info',FilePath)                    
                
                self.Write_Log('info',"for dates 2nd to 7th in new quarter, appending data in the previous Quaterly file.....")  
                
                if((currentMonth is first_month_in_quarter) and (currentDay > 1 and currentDay < 8)):
                    if 'Contents' in result_previous:
                        obj_q_prev = s3_client.get_object(Bucket=AWS_S3_BUCKET, Key=quarterly_previous_key)
                        self.Write_Log('info',"appening to in previousquarter_value")
                        self.Write_Log('info',"In 1st 7 days of month in new Quarter")
                        wb_prev.save(path)  
                        daily = pd.read_excel(obj['Body'].read())
                       
                        #quarterly = pd.read_excel(quarterly_key)
                        quarterly = pd.read_excel(obj_q_prev['Body'].read())

                        #self.Write_Log('info',i)
                        all_df_list = [daily, quarterly]

                        # Pandas will automatically append based on similar column names
                        prev_df = pd.concat(all_df_list)
                        self.Write_Log('info',"PREV DF before\n")                        
                        self.Write_Log('info',prev_df)
                                                                
                        if (quarter_number == 1 and first_month_in_quarter == 1): 
                            startdate_prev = str(currentYear-1)+"-10-01T00:00:00"
                            enddate_prev = str(currentYear-1)+"-01-01T00:00:00"                    

                            new_prev_df = prev_df.loc[(prev_df['Time'] >= startdate_prev) & (prev_df['Time'] < enddate_prev)]
                            new_prev_df = new_prev_df.drop_duplicates()

                            self.Write_Log('info',"PREV AFTER")
                            self.Write_Log('info',new_prev_df)
                            
                        if (quarter_number == 2 and first_month_in_quarter == 4): 
                            startdate_prev = str(currentYear)+"-01-01T00:00:00"
                            enddate_prev = str(currentYear)+"-04-01T00:00:00" 
                            
                            new_prev_df = prev_df.loc[(prev_df['Time'] >= startdate_prev) & (prev_df['Time'] < enddate_prev)]
                            new_prev_df = new_prev_df.drop_duplicates()


                            self.Write_Log('info',"PREV AFTER")
                            self.Write_Log('info',new_prev_df)

                        if (quarter_number == 3 and first_month_in_quarter == 7):   
                            startdate_prev = str(currentYear)+"-04-01T00:00:00"
                            enddate_prev = str(currentYear)+"-07-01T00:00:00"  
                            
                            new_prev_df = prev_df.loc[(prev_df['Time'] >= startdate_prev) & (prev_df['Time'] < enddate_prev)]
                            new_prev_df = new_prev_df.drop_duplicates()


                            self.Write_Log('info',"PREV AFTER")
                            self.Write_Log('info',new_prev_df)

                        if (quarter_number == 4 and first_month_in_quarter == 10):
                            startdate_prev = str(currentYear)+"-07-01T00:00:00"                    
                            enddate_prev = str(currentYear)+"-10-01T00:00:00"   
                            
                            new_prev_df = prev_df.loc[(prev_df['Time'] >= startdate_prev) & (prev_df['Time'] < enddate_prev)]
                            new_prev_df = new_prev_df.drop_duplicates()


                            self.Write_Log('info',"PREV AFTER")
                            self.Write_Log('info',new_prev_df)
                        
                        with io.BytesIO() as output_prev:
                            with pd.ExcelWriter(output_prev, engine='xlsxwriter') as writer:
                                new_prev_df.to_excel(writer, sheet_name='Sheet1', startrow=1, header=False, index=False)
                                # Get the xlsxwriter workbook and worksheet objects.
                                workbook  = writer.book
                                worksheet = writer.sheets['Sheet1']

                                # Add a header format.
                                header_format = workbook.add_format({
                                    'bold': True,
                                    'text_wrap': True,
                                    'valign': 'top',
                                    'fg_color': '#75ffbf',
                                    'border': 1})
                                # Write the column headers with the defined format.
                                for col_num, value in enumerate(new_prev_df.columns.values):
                                    new_prev_df.columns.str.upper()
                                    worksheet.write(0, col_num , value, header_format)
                                    
                                column_settings = [{'header': column} for column in new_prev_df.columns]
                                (max_row, max_col) = new_prev_df.shape

                                worksheet.add_table(0, 0, max_row, max_col - 1, {'columns': column_settings})
                                border_fmt = workbook.add_format({'bottom':1, 'top':1, 'left':1, 'right':1})
                                worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(new_prev_df), len(new_prev_df.columns)), {'type': 'no_errors', 'format': border_fmt})
                                worksheet.autofit()

                            data_prev = output_prev.getvalue()
                            #self.Write_Log('info',"dataprev\n",data_prev)

                            response = s3_client.put_object(
                                Bucket=AWS_S3_BUCKET, Key=quarterly_previous_key, Body=data_prev
                            )

                            status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

                            if status == 200:
                                self.Write_Log('info',"Successful file put_object response for PREVIOUS QUARTERLY REPORT ")                                
                                self.Write_Log('info',FilePathPrevious)
                            else:
                                self.Write_Log('info',"Successful file put_object response for PREVIOUS QUARTERLY REPORT ")                                
                                self.Write_Log('info',FilePathPrevious)

            else:   
                self.Write_Log('info',"Autotrack Quartertly File exists in the bucket. Now Append the Data from Daily Report")
              
                retData = self.CreateExcelData(QueryResult)           
                fieldscount = len(retData)

                df = pd.DataFrame(
                    data= retData
                )
                
                self.Write_Log('info',"beofre df")
                self.Write_Log('info',df)
                

                
                if (quarter_number == 1 and first_month_in_quarter == 1): 
                    startdate = str(currentYear)+"-01-01T00:00:00"
                    enddate = str(currentYear)+"-03-31T23:59:59"
                    startdate_prev = str(currentYear-1)+"-10-01T00:00:00"
                    enddate_prev = str(currentYear-1)+"-01-01T00:00:00"                    

                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df)                                          
                if (quarter_number == 2 and first_month_in_quarter == 4): 
                    startdate = str(currentYear)+"-04-01T00:00:00"
                    enddate = str(currentYear)+"-06-30T23:59:59"
                    startdate_prev = str(currentYear)+"-01-01T00:00:00"
                    enddate_prev = str(currentYear)+"-04-01T00:00:00" 
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df) 
                if (quarter_number == 3 and first_month_in_quarter == 7):   
                    startdate = str(currentYear)+"-07-01T00:00:00"
                    enddate = str(currentYear)+"-09-30T23:59:59"
                    startdate_prev = str(currentYear)+"-04-01T00:00:00"
                    enddate_prev = str(currentYear)+"-07-01T00:00:00"  
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df)                   
                if (quarter_number == 4 and first_month_in_quarter == 10):
                    startdate = str(currentYear)+"-10-01T00:00:00"
                    enddate = str(currentYear)+"-12-31T23:59:59"
                    startdate_prev = str(currentYear)+"-07-01T00:00:00"                    
                    enddate_prev = str(currentYear)+"-10-01T00:00:00"   
                    
                    current_df = df.loc[(df['Time'] >= startdate) & (df['Time'] <= enddate)]
                    new_prev_df = df.loc[(df['Time'] >= startdate_prev) & (df['Time'] < enddate_prev)]
                    current_df = current_df.drop_duplicates()
                    new_prev_df = new_prev_df.drop_duplicates()

                    self.Write_Log('info',"PREV")
                    self.Write_Log('info',new_prev_df)
                    self.Write_Log('info',"CURRENT")
                    self.Write_Log('info',current_df) 

                with io.BytesIO() as output:
                    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                        current_df.to_excel(writer, sheet_name='Sheet1', startrow=1, header=False, index=False)
                        # Get the xlsxwriter workbook and worksheet objects.
                        workbook  = writer.book
                        worksheet = writer.sheets['Sheet1']

                        # Add a header format.
                        header_format = workbook.add_format({
                            'bold': True,
                            'text_wrap': True,
                            'valign': 'top',
                            'fg_color': '#75ffbf',
                            'border': 1})

                        # Write the column headers with the defined format.
                        for col_num, value in enumerate(current_df.columns.values):
                            current_df.columns.str.upper()
                            worksheet.write(0, col_num , value, header_format)
                            
                        column_settings = [{'header': column} for column in current_df.columns]
                        (max_row, max_col) = current_df.shape

                        worksheet.add_table(0, 0, max_row, max_col - 1, {'columns': column_settings})
                        border_fmt = workbook.add_format({'bottom':1, 'top':1, 'left':1, 'right':1})
                        worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(current_df), len(current_df.columns)), {'type': 'no_errors', 'format': border_fmt})
                        worksheet.autofit()



                    data = output.getvalue()
                    

                    response = s3_client.put_object(
                        Bucket=AWS_S3_BUCKET, Key=quarterly_current_key, Body=data
                    )

                    status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

                    if status == 200:
                        self.Write_Log('info',"Successful file put_object response Created quarterly report 1st time Status ")                                
                        self.Write_Log('info',FilePath)
                    else:
                        self.Write_Log('info',"Unsuccessful file put_object response Created quarterly report 1st time Status ")                                
                        self.Write_Log('info',FilePath)
                         
                with io.BytesIO() as output_prev:
                    with pd.ExcelWriter(output_prev, engine='xlsxwriter') as writer_prev:
                        new_prev_df.to_excel(writer_prev, sheet_name='Sheet1', startrow=1, header=False, index=False)
                        # Get the xlsxwriter workbook and worksheet objects.
                        workbook_prev  = writer_prev.book
                        worksheet_prev = writer_prev.sheets['Sheet1']

                        # Add a header format.
                        header_format = workbook_prev.add_format({
                            'bold': True,
                            'text_wrap': True,
                            'valign': 'top',
                            'fg_color': '#75ffbf',
                            'border': 1})

                        # Write the column headers with the defined format.
                        for col_num, value in enumerate(new_prev_df.columns.values):
                            new_prev_df.columns.str.upper()
                            worksheet_prev.write(0, col_num , value, header_format)
                            
                        column_settings = [{'header': column} for column in new_prev_df.columns]
                        (max_row, max_col) = new_prev_df.shape

                        worksheet_prev.add_table(0, 0, max_row, max_col - 1, {'columns': column_settings})
                        border_fmt = workbook_prev.add_format({'bottom':1, 'top':1, 'left':1, 'right':1})
                        worksheet_prev.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(new_prev_df), len(new_prev_df.columns)), {'type': 'no_errors', 'format': border_fmt})
                        worksheet_prev.autofit()
                        
                    #check if previous Q file exists
                    data_prev = output_prev.getvalue()
                    if 'Contents' in result_previous:
                        self.Write_Log('info',"appening to in previousquarter_value")
                        
                        response_previous = s3_client.put_object(
                            Bucket=AWS_S3_BUCKET, Key=quarterly_previous_key, Body=data_prev
                        )
                        
                        status = response_previous.get("ResponseMetadata", {}).get("HTTPStatusCode")
                        if status == 200:
                            self.Write_Log('info',"Successful file put_object response Appened current quarter contents previous quarterly report 1st time  ")                                
                            self.Write_Log('info',FilePathPrevious)
                        else:
                            self.Write_Log('info',"Successful file put_object response Appened current quarter contents previous quarterly report 1st time  ")                                
                            self.Write_Log('info',FilePathPrevious)
                        
                                               
                self.Write_Log('info',"First Time Execution Completed Successfully, Daily Report Data appened to both quarter files according to start and end date of entries")
                
                
            #print the outut for script execution success   
            self.result['retCode'] = "0"
            self.result['retDesc'] = "GRC Sample Report  (Excel File) Created"
            self.result['FilePath'] = FilePath
            self.result['FileName'] = FileName
            self.result['Successflag'] = "0"
            return (True, json.loads(json.dumps(self.result)))
            
            
        except Exception as err:
        # if any error occurred during script execution
            Msg=str(err)
            #self.Write_Log('info',err)
            self.Write_Log('error', 'report creation failed')            
            Msg=Msg.split('\n')[0]
            self.result['retCode'] = "1"
            self.result['retDesc'] = "Script failed for Report creation - {0}".format(Msg)
            self.result['FilePath'] = 'NA'
            self.result['FileName'] = 'NA'
            self.result['Successflag'] = "1"
            return (False, json.loads(json.dumps(self.result)))
    
    def upload_workbook(workbook, bucket, key):
        with NamedTemporaryFile() as tmp:
            workbook.save(tmp.name)
            tmp.seek(0)
            s3.meta.client.upload_file(tmp.name, bucket, key)
        
    def CreateExcelData(self,QueryResult):
        try:
            count = len(QueryResult)
            if(count<=0):
                return count
            else:
                first_row = QueryResult[0]
                #self.Write_Log('info',first_row.keys())
                data = dict()
                for key in first_row.keys():
                    temp_list =[]
                    for row in QueryResult:
                        temp_list.append(row.get(key))
                    data[key] = temp_list
            return(data)

        except Exception as err:
        # if any error occurred during script execution
            Msg=str(err)
            Msg=Msg.split('\n')[0]
            self.result['retCode'] = "1"
            self.result['retDesc'] = "Script failed for Creating Excel Data - {0}".format(Msg)
            self.result['FilePath'] = 'NA'
            self.result['FileName'] = 'NA'
            self.result['Successflag'] = "1"
            return (False, json.loads(json.dumps(self.result)))


    def Write_Log(self, log_type,log_message):
        # User defined function to Write Log messages
        try:
            logMessage_dateTime_format = "%d-%m-%Y %H:%M:%S:%f"
            dateTime = datetime.now().strftime(logMessage_dateTime_format)
            if(log_type == "info"):
                #self.logger.info(dateTime + " - " + log_message)
                print(dateTime + " - " + log_message)
            elif(log_type == "error"):
                self.logger.error(dateTime + " - " + log_message)
            elif(log_type == "warning"):
                self.logger.warning(dateTime + " - " + log_message)
        except Exception as err:
            Msg=str(err)
QueryResult= [{"a":"J","User":"a","Time":"2024-09-28T04:37:25","ID":12},{"a":"K","User":"b","Time":"2024-10-02T04:07:28","ID":23}]
FolderPath=r"/local/path"
FolderName="a/"
print(Mytestfunction().run(QueryResult,FolderPath,FolderName))

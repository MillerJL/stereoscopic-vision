//#include <stdafx.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <iostream>
#include <fstream>
#include <string>
#include <sstream>


using namespace std;


double frame_correlation(string file) {
    string a[7];
    string line;
    ifstream myfile(file);
    if (myfile.is_open()) {
        int count = 0;
        int y = 0;
        while (getline(myfile, line)) {
            
            count++;
            cout << "count: " << count << endl;
            int size = line.size();
            
            for (int i = 0; i < 7; i++) {
                a[i] = "";
            }
            if (count == 18) {
                cout << line << endl;
                
                int i = 0;
                stringstream ssin(line);
                while (ssin.good() && i < 7) {
                    ssin >> a[i];
                    ++i;
                }
                for (i = 0; i < 7; i++) {
                    cout << a[i] << endl;
                }
                break;
            }
            
        }
    }
    int x = 0;
    string t[3];
    for (int i = 0; i < 3; i++) {
        t[i] = "";
    }
    for (int i = 0; i < 11; i++) {
        if (a[1][i] != ':') {
            t[x] += a[1][i];
        }
        else {
            x++;
        }
    }
    for (int i = 0; i < 3; i++) {
        cout << t[i] << endl;
    }
    double total_time = 0;
    total_time += (stod(t[0].c_str()) * 3600);
    total_time += (stod(t[1].c_str()) * 60);
    total_time += (stod(t[2].c_str()));
    return total_time;
}


int main(int, char**)
{
    //.........................................................................
    // NAME VIDEOS VIDEO1 AND VIDEO2. OUTPUT VIDEO WILL BE NAMED finalVideo.mp4
    //.........................................................................
    
    system("ffmpeg -i left3.mp4 > output1.txt 2>&1");
    system("ffmpeg -i right3.mp4 > output2.txt 2>&1");
    
    double difference;
    double left_time = frame_correlation("output1.txt");
    double right_time = frame_correlation("output2.txt");
    
    if (right_time > left_time) {
        difference = right_time - left_time;
        ostringstream strs;
        strs << difference;
        string s = strs.str();
        string command = "ffmpeg -i right3.mp4 -ss " + s + " RC.mp4";
        system(command.c_str());
        system("ffmpeg -i left3.mp4 -vf scale=960:540 output1.mp4");
        system("ffmpeg -i RC.mp4 -vf scale=960:540 output2.mp4");
        system("rm -f RC.mp4");
        
    }
    if (left_time > right_time) {
        difference = left_time - right_time;
        ostringstream strs;
        strs << difference;
        string s = strs.str();
        string command = "ffmpeg -i left3.mp4 -ss " + s + " LC.mp4";
        system(command.c_str());
        system("ffmpeg -i LC.mp4 -vf scale=960:540 output1.mp4");
        system("ffmpeg -i right3.mp4 -vf scale=960:540 output2.mp4");
        system("rm -f LC.mp4");
    }
    if (left_time == right_time) {
        difference = 0;
        system("ffmpeg -i left3.mp4 -vf scale=960:540 output1.mp4");
        system("ffmpeg -i right3.mp4 -vf scale=960:540 output2.mp4");
        
        
    }
    
    
    
    
    
    
    // stabilizing video 1
    system("ffmpeg -i output1.mp4 -vf vidstabdetect=stepsize=6:shakiness=8:accuracy=9:result=transform_vectors.trf -f null -");
    system("ffmpeg -i output1.mp4 -vf vidstabtransform=input=transform_vectors.trf:zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4 -vcodec libx264 -preset slow -tune film -crf 18 -acodec copy smoothedVideo1.mp4");
    
    // stabilizing video2
    
    system("ffmpeg -i output2.mp4 -vf vidstabdetect=stepsize=6:shakiness=8:accuracy=9:result=transform_vectors.trf -f null -");
    system("ffmpeg -i output2.mp4 -vf vidstabtransform=input=transform_vectors.trf:zoom=1:smoothing=30,unsharp=5:5:0.8:3:3:0.4 -vcodec libx264 -preset slow -tune film -crf 18 -acodec copy smoothedVideo2.mp4");
    
    // side by side conversion
    
    
   
    //system("ffmpeg -i smoothed.mp4 -vcodec libx264 -x264opts  \"frame - packing = 3:frame - packing - interpret = 1 : frame - packing - quincunx = 0 : frame - packing - grid = 0, 0, 0, 0 \" output_file.mp4");
   // system("ffmpeg -i smoothedVideo1.mp4 -i smoothedVideo2.mp4 -filter_complex \"[0:v:0]pad=iw*2:ih[bg]; [bg][1:v:0]overlay=w\" scale=5120x5120 finalVideo.mp4");

    
    system("ffmpeg -i smoothedVideo1.mp4 -i smoothedVideo2.mp4 -filter_complex \"[0:v:0]pad=iw*2:ih[bg]; [bg][1:v:0]overlay=w\" finalVideo.mp4");
    
    system("rm -f output1.mp4");
    system("rm -f output2.mp4");
    system("rm -f smoothedVideo1.mp4");
    system("rm -f smoothedVideo2.mp4");
    system("rm -f output1.txt");
    system("rm -f output2.txt");
    
    
}
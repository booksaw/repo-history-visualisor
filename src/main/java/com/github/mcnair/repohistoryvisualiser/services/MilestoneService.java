package com.github.mcnair.repohistoryvisualiser.services;

import com.github.mcnair.repohistoryvisualiser.exception.IllegalMilestonesException;
import com.github.mcnair.repohistoryvisualiser.exception.IllegalURLException;
import com.github.mcnair.repohistoryvisualiser.repository.Milestones;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MilestoneService {

    @Autowired
    private URLService URLService;

    public Milestones manageMilestones(String url) throws IllegalMilestonesException {

        List<String> result;

        try {
            result = URLService.performURLGet(url);

        } catch (IllegalURLException e) {
            throw new IllegalMilestonesException(url, e);
        }
        if (result == null) {
            throw new IllegalMilestonesException(url);
        }

        return extractMilestoneData(result);
    }

    public Milestones extractMilestoneData(List<String> result) throws IllegalMilestonesException {
        Milestones milestones = new Milestones();

        for (String resultStr : result) {
            String[] split = resultStr.split("(?<!\\\\),");

            if (split.length != 2) {
                throw new IllegalMilestonesException();
            }

            milestones.put(split[0], split[1]);
        }

        return milestones;
    }

}

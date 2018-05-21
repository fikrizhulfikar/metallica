package com.iconpln.liquiditas.monitoring;


import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService;
import java.util.concurrent.ExecutionException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FirebaseNotificationServiceTest {

    @Autowired
    private FirebaseNotificationService firebaseNotificationService;


}
